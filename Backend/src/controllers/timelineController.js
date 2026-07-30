import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import SellRequest from '../models/SellRequest.js';
import Deal from '../models/Deal.js';
import Paperwork from '../models/Paperwork.js';
import Meeting from '../models/Meeting.js';
import Inspection from '../models/Inspection.js';

const formatTimelineEvent = (event, type) => ({
  type,
  title: event.title,
  description: event.description,
  status: event.status,
  date: event.date,
  metadata: event.metadata
});

export const getSellRequestTimeline = catchAsync(async (req, res, next) => {
  const sellRequest = await SellRequest.findById(req.params.id)
    .populate('inspectedBy', 'name')
    .populate('assignedOfficial', 'name')
    .lean();

  if (!sellRequest) {
    return next(new AppError('Sell request not found', 404));
  }

  const timeline = [
    formatTimelineEvent({
      title: 'Sell Request Submitted',
      description: `${sellRequest.brand} ${sellRequest.model} ${sellRequest.variant} submitted for selling`,
      status: 'completed',
      date: sellRequest.createdAt,
      metadata: { step: 1 }
    }, 'sell_request_created'),
    formatTimelineEvent({
      title: 'Request Under Review',
      description: 'Our team is reviewing your sell request',
      status: sellRequest.status === 'pending' ? 'current' : 'completed',
      date: sellRequest.updatedAt,
      metadata: { step: 2 }
    }, 'under_review')
  ];

  if (['inspection_scheduled', 'inspection_completed', 'approved', 'rejected', 'listed', 'cancelled'].includes(sellRequest.status)) {
    timeline.push(formatTimelineEvent({
      title: 'Inspection Scheduled',
      description: sellRequest.inspectionDate 
        ? `Inspection scheduled for ${new Date(sellRequest.inspectionDate).toLocaleDateString()}`
        : 'Inspection scheduled',
      status: ['inspection_scheduled', 'inspection_completed', 'approved', 'rejected', 'listed', 'cancelled'].includes(sellRequest.status) ? 'completed' : 'current',
      date: sellRequest.inspectionDate || sellRequest.updatedAt,
      metadata: { step: 3, inspectionDate: sellRequest.inspectionDate }
    }, 'inspection_scheduled'));
  }

  if (['inspection_completed', 'approved', 'rejected', 'listed', 'cancelled'].includes(sellRequest.status)) {
    timeline.push(formatTimelineEvent({
      title: 'Inspection Completed',
      description: 'Vehicle inspection has been completed by our official',
      status: 'completed',
      date: sellRequest.updatedAt,
      metadata: { step: 4, notes: sellRequest.inspectionNotes }
    }, 'inspection_completed'));
  }

  if (['approved', 'rejected', 'listed', 'cancelled'].includes(sellRequest.status)) {
    const statusTitle = sellRequest.status === 'approved' ? 'Request Approved' : 
                        sellRequest.status === 'rejected' ? 'Request Rejected' :
                        sellRequest.status === 'listed' ? 'Vehicle Listed' : 'Request Cancelled';
    const statusDesc = sellRequest.status === 'approved' ? 'Your vehicle has been approved for listing' :
                       sellRequest.status === 'rejected' ? `Reason: ${sellRequest.rejectionReason || 'Not specified'}` :
                       sellRequest.status === 'listed' ? 'Your vehicle is now live on our platform' : 'Request has been cancelled';
    
    timeline.push(formatTimelineEvent({
      title: statusTitle,
      description: statusDesc,
      status: sellRequest.status === 'cancelled' ? 'cancelled' : 'completed',
      date: sellRequest.updatedAt,
      metadata: { step: 5, rejectionReason: sellRequest.rejectionReason }
    }, sellRequest.status));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Sell request timeline retrieved successfully',
    data: { timeline }
  });
});

export const getDealTimeline = catchAsync(async (req, res, next) => {
  const deal = await Deal.findById(req.params.id)
    .populate('car', 'brand model variant')
    .populate('official', 'name')
    .lean();

  if (!deal) {
    return next(new AppError('Deal not found', 404));
  }

  const timeline = [
    formatTimelineEvent({
      title: 'Deal Created',
      description: `Deal created for ${deal.car.brand} ${deal.car.model} at ₹${deal.agreedPrice.toLocaleString()}`,
      status: 'completed',
      date: deal.createdAt,
      metadata: { step: 1, agreedPrice: deal.agreedPrice }
    }, 'deal_created'),
    formatTimelineEvent({
      title: 'Payment Pending',
      description: 'Waiting for payment to be received',
      status: deal.status === 'pending_payment' ? 'current' : 
              ['payment_received', 'documents_pending', 'completed'].includes(deal.status) ? 'completed' : 'pending',
      date: deal.updatedAt,
      metadata: { step: 2 }
    }, 'pending_payment')
  ];

  if (['payment_received', 'documents_pending', 'completed'].includes(deal.status)) {
    timeline.push(formatTimelineEvent({
      title: 'Payment Received',
      description: `Payment of ₹${deal.paymentDetails?.amount?.toLocaleString() || deal.agreedPrice.toLocaleString()} received via ${deal.paymentDetails?.method || 'bank transfer'}`,
      status: 'completed',
      date: deal.paymentDetails?.receivedAt || deal.updatedAt,
      metadata: { step: 3, paymentDetails: deal.paymentDetails }
    }, 'payment_received'));
  }

  if (['documents_pending', 'completed'].includes(deal.status)) {
    timeline.push(formatTimelineEvent({
      title: 'Documents Processing',
      description: 'Documentation for ownership transfer is in progress',
      status: deal.status === 'documents_pending' ? 'current' : 'completed',
      date: deal.updatedAt,
      metadata: { step: 4 }
    }, 'documents_pending'));
  }

  if (deal.status === 'completed') {
    timeline.push(formatTimelineEvent({
      title: 'Deal Completed',
      description: 'All documents verified and ownership transferred successfully',
      status: 'completed',
      date: deal.completedAt || deal.updatedAt,
      metadata: { step: 5 }
    }, 'completed'));
  } else if (deal.status === 'cancelled') {
    timeline.push(formatTimelineEvent({
      title: 'Deal Cancelled',
      description: deal.cancellationReason ? `Reason: ${deal.cancellationReason}` : 'Deal was cancelled',
      status: 'cancelled',
      date: deal.cancelledAt || deal.updatedAt,
      metadata: { step: 5, reason: deal.cancellationReason }
    }, 'cancelled'));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Deal timeline retrieved successfully',
    data: { timeline }
  });
});

export const getPaperworkTimeline = catchAsync(async (req, res, next) => {
  const paperwork = await Paperwork.findById(req.params.id)
    .populate('deal', 'car agreedPrice')
    .populate('deal.car', 'brand model variant')
    .lean();

  if (!paperwork) {
    return next(new AppError('Paperwork not found', 404));
  }

  const timeline = [
    formatTimelineEvent({
      title: 'Paperwork Initiated',
      description: 'Paperwork process has been started for your deal',
      status: 'completed',
      date: paperwork.createdAt,
      metadata: { step: 1 }
    }, 'initiated'),
    formatTimelineEvent({
      title: 'Documents Uploaded',
      description: `${paperwork.documents?.length || 0} documents have been uploaded`,
      status: paperwork.status === 'documents_uploaded' ? 'current' : 
              ['under_review', 'client_action_required', 'completed'].includes(paperwork.status) ? 'completed' : 'pending',
      date: paperwork.updatedAt,
      metadata: { step: 2, documentCount: paperwork.documents?.length || 0 }
    }, 'documents_uploaded')
  ];

  if (['under_review', 'client_action_required', 'completed'].includes(paperwork.status)) {
    timeline.push(formatTimelineEvent({
      title: 'Under Review',
      description: 'Our team is reviewing the submitted documents',
      status: paperwork.status === 'under_review' ? 'current' : 'completed',
      date: paperwork.updatedAt,
      metadata: { step: 3 }
    }, 'under_review'));
  }

  if (['client_action_required', 'completed'].includes(paperwork.status)) {
    timeline.push(formatTimelineEvent({
      title: 'Client Action Required',
      description: paperwork.officialNotes || 'Additional documents or actions required from you',
      status: paperwork.status === 'client_action_required' ? 'current' : 'completed',
      date: paperwork.updatedAt,
      metadata: { step: 4, notes: paperwork.officialNotes }
    }, 'client_action_required'));
  }

  if (paperwork.status === 'completed') {
    timeline.push(formatTimelineEvent({
      title: 'Paperwork Completed',
      description: 'All documents verified and paperwork finalized',
      status: 'completed',
      date: paperwork.completedAt || paperwork.updatedAt,
      metadata: { step: 5 }
    }, 'completed'));
  } else if (paperwork.status === 'rejected') {
    timeline.push(formatTimelineEvent({
      title: 'Paperwork Rejected',
      description: paperwork.officialNotes || 'Paperwork was rejected due to discrepancies',
      status: 'rejected',
      date: paperwork.updatedAt,
      metadata: { step: 5, reason: paperwork.officialNotes }
    }, 'rejected'));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Paperwork timeline retrieved successfully',
    data: { timeline }
  });
});
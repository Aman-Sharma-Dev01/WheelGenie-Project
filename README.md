
# WheelGenie-Project



                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {topics.map((t) => {
              const IconComp = t.icon;
              const isSelected = formData.topic === t.name;

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleTopicSelect(t.name)}
                  className={`text-left p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'border-wg-blue bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
                      : 'border-slate-200/90 bg-white hover:border-blue-300 hover:shadow-lg hover:-translate-y-1'
                  }`}
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${t.iconBg}`}>
                      <IconComp size={22} />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-wg-blue transition-colors">
                      {t.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      {t.desc}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-wg-blue">
                    <span>{t.cta}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
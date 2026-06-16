export function LandingHeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[320px] py-8 lg:max-w-none lg:py-12">
      {/* glow blobs */}
      <div
        className="pointer-events-none absolute left-0 top-1/4 hidden h-64 w-64 -translate-x-1/3 rounded-full bg-[#560200]/10 blur-3xl lg:block"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 hidden h-48 w-48 translate-x-1/4 rounded-full bg-[#f8a5b8]/20 blur-3xl lg:block"
        aria-hidden="true"
      />

      {/* 3-D perspective wrapper */}
      <div style={{ perspective: "1100px" }}>
        <div
          style={{
            transform: "rotateY(-8deg) rotateX(4deg)",
            transformStyle: "preserve-3d",
            transition: "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
          }}
          className="relative rounded-[2rem] border border-white/10 bg-[#141415] p-[3px] shadow-[0_40px_100px_rgba(20,20,21,0.22),0_12px_40px_rgba(86,2,0,0.12)]"
        >
          {/* subtle inner glow on frame */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-60"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)",
            }}
          />

          <div className="overflow-hidden rounded-[1.65rem] bg-white">
            {/* App header */}
            <div className="bg-[#560200] px-4 pb-3 pt-3.5 text-white">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f2e8d8] text-[0.68rem] font-bold text-[#560200]">
                    a
                  </span>
                  <div>
                    <p className="text-[0.92rem] font-bold leading-tight">aribrì</p>
                    <p className="text-[0.66rem] text-[#f2e8d8]/80">
                      Ristorante · Pizzeria · B&B
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {["IT", "EN", "FR"].map((l) => (
                    <span
                      key={l}
                      className="rounded-full bg-white/15 px-1.5 py-0.5 text-[0.58rem] font-bold"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              {/* category tabs */}
              <div className="flex gap-1.5 overflow-hidden">
                {["Antipasti", "Primi", "Secondi"].map((c, i) => (
                  <span
                    key={c}
                    className={`shrink-0 rounded-full px-3 py-1 text-[0.7rem] font-semibold transition-colors ${
                      i === 0
                        ? "bg-white text-[#560200]"
                        : "bg-white/15 text-white"
                    }`}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Dish list */}
            <div className="space-y-2 bg-[#f7f7f7] px-3 py-3">
              {[
                {
                  name: "Carpaccio di manzo",
                  desc: "Rucola, grana, olio EVO",
                  price: "€14",
                  tags: ["glutine", "latte"],
                  favorite: true,
                },
                {
                  name: "Bruschette al pomodoro",
                  desc: "Pomodoro fresco, basilico, EVOO",
                  price: "€8",
                  tags: ["glutine"],
                  favorite: false,
                },
              ].map((dish) => (
                <div
                  key={dish.name}
                  className="rounded-xl bg-white px-3 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-[0.84rem] font-bold text-[#141415]">
                          {dish.name}
                        </p>
                        {dish.favorite && (
                          <svg
                            viewBox="0 0 12 12"
                            width="10"
                            height="10"
                            fill="#560200"
                            aria-hidden="true"
                            className="shrink-0"
                          >
                            <path d="M6 10.5S1.5 7.3 1.5 4.5C1.5 3 2.7 2 4.1 2c.9 0 1.6.5 2 1.1C6.5 2.5 7.2 2 8.1 2 9.5 2 10.5 3 10.5 4.5c0 2.8-4.5 6-4.5 6z" />
                          </svg>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-[0.7rem] text-[#888]">
                        {dish.desc}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {dish.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded bg-[#f5f5f5] px-1.5 py-0.5 text-[0.6rem] font-medium text-[#888]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="shrink-0 text-[0.84rem] font-bold text-[#141415]">
                      {dish.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom bar */}
            <div className="flex items-center justify-between border-t border-[#f0f0f0] px-4 py-2.5">
              <p className="text-[0.64rem] text-[#adadad]">
                Aggiornato · adesso
              </p>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-4 rounded-full bg-[#560200]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#d8dadc]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#d8dadc]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge — AI */}
      <div className="absolute -right-3 top-4 rounded-2xl border border-[#ececec] bg-white px-3 py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.1)] sm:-right-8">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#560200] text-white">
            <svg viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden="true">
              <path
                d="M8 2l1 3.5L12.5 6.5 9 7.5 8 11l-1-3.5L3.5 6.5 7 5.5 8 2zM12 9l.5 2 2 .5-2 .5L12 14l-.5-2-2-.5 2-.5L12 9z"
                fill="white"
              />
            </svg>
          </span>
          <div>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-[#adadad]">
              AI
            </p>
            <p className="text-[0.78rem] font-bold text-[#141415]">
              Attivo
            </p>
          </div>
        </div>
      </div>

      {/* Floating badge — Lingue */}
      <div className="absolute -left-3 bottom-6 rounded-2xl border border-[#ececec] bg-white px-3 py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.1)] sm:-left-8">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-[#adadad]">
          Lingue
        </p>
        <p className="mt-0.5 text-[0.8rem] font-bold leading-none text-[#141415]">
          IT · EN · FR
          <br />
          DE · ES
        </p>
      </div>
    </div>
  );
}

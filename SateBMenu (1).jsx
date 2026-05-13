    import React, { useState, useEffect, useRef } from "react";

/**
 * Sate B - Interactive Digital QR-Code Menu
 * CPIT-380 Multimedia Technologies — Community Service Project
 *
 * Drop this file into a React project that has Tailwind CSS configured.
 * The fonts "Cairo" and "Tajawal" are loaded from Google Fonts inside the
 * component, so no extra setup is required.
 *
 * Layout strategy (mimics a printed menu):
 *   • "mixed" and "satay" sections show a large full-width HERO image
 *     above the item list.
 *   • "main" and "extras" sections use a 12-column grid: an 8-col item
 *     list on the right, with a TALL composite image sticky on the left.
 *   • Individual item cards only render a thumbnail when item.image is
 *     set — otherwise the card collapses to a clean text + price line.
 *
 * Required images (place in /public/images/):
 *   /images/mixed-meals-hero.png   (Layout A hero — bowl with all sides)
 *   /images/satay-hero.png         (Layout A hero — satay platter)
 *   /images/main-sides-tall.png    (Layout B tall — 6 side dishes stack)
 *   /images/extras-tall.png        (Layout B tall — extras stack)
 *   /images/bao.jpg                (single-item thumbnail for باو)
 *   /images/noodles.jpg            (single-item thumbnail for نودلز بي خضار)
 */

// ─── Menu Data (Arabic) ──────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: "mixed",
    name: "الوجبات المشكلة",
    nameEn: "Mixed Meals",
    icon: "🍱",
    items: [
      { name: "مشكل صغير", desc: "صنف واحد لحم أو دجاج", price: 26, image: "" },
      { name: "مشكل صغير", desc: "صنفين لحم ودجاج", price: 31, image: "" },
      { name: "مشكل كبير", desc: "تشكيلة كاملة من الأطباق", price: 35, image: "" },
      { name: "مشكل كبير", desc: "مع رز خارجي", price: 38, image: "" },
      { name: "مشكل كبير", desc: "مع 4 أعواد ساتي", price: 46, image: "" },
      { name: "مشكل عائلي", desc: "يكفي 4-5 أشخاص", price: 145, image: "", featured: true },
      { name: "باو", desc: "دجاج أو زنجر", price: 22, image: "/images/bao.jpg" },
    ],
  },
  {
    id: "satay",
    name: "ساتي ونودلز",
    nameEn: "Satay & Noodles",
    icon: "🍢",
    items: [
      { name: "ساتي جامبو دجاج", desc: "10 أعواد", price: 28, image: "" },
      { name: "ساتي جامبو لحم", desc: "10 أعواد", price: 32, image: "" },
      { name: "ساتي جامبو جمبري", desc: "10 أعواد", price: 36, image: "" },
      { name: "ساتي مكس", desc: "9 أعواد متنوعة", price: 30, image: "" },
      { name: "ساتي كومبو", desc: "24 عود دجاج + 2 رز + 2 شوربة", price: 70, image: "", featured: true },
      { name: "نودلز بي خضار", desc: "نكهة إندونيسية أصيلة", price: 15, image: "/images/noodles.jpg" },
      { name: "بوكس الشواء", desc: "50 عود ساتي جاهزة للشواء مع صوص اللوز", price: 150, image: "", featured: true },
    ],
  },
  {
    id: "main",
    name: "أطباق رئيسية وجانبية",
    nameEn: "Main Dishes & Sides",
    icon: "🍛",
    items: [
      { name: "دجاج بالكاتشب", desc: "", price: 25, image: "" },
      { name: "دجاج بالنارجيل", desc: "", price: 25, image: "" },
      { name: "لحم رندانغ", desc: "الطبق الإندونيسي الشهير", price: 28, image: "" },
      { name: "دندن", desc: "", price: 30, image: "" },
      { name: "بيض بالخلطة", desc: "3 حبات", price: 9, image: "" },
      { name: "كفتة بطاطس", desc: "4 حبات", price: 8, image: "" },
      { name: "بطاطس مكعبات", desc: "", price: 10, image: "" },
      { name: "مكرونة خواتم", desc: "", price: 10, image: "" },
      { name: "فاصوليا مقلقلة", desc: "", price: 10, image: "" },
      { name: "باذنجان بالصوص", desc: "", price: 8, image: "" },
      { name: "قادو بي", desc: "", price: 12, image: "" },
    ],
  },
  {
    id: "extras",
    name: "إضافات ومشروبات",
    nameEn: "Add-ons & Drinks",
    icon: "🥤",
    items: [
      { name: "رز مقلي", desc: "", price: 12, image: "" },
      { name: "رز أبيض", desc: "", price: 5, image: "" },
      { name: "سنجبس / بطاطس مبشور", desc: "", price: 5, image: "" },
      { name: "شيبس", desc: "", price: 8, image: "" },
      { name: "شيبس حراق", desc: "", price: 8, image: "" },
      { name: "كربوك", desc: "", price: 6, image: "" },
      { name: "شوربة", desc: "حجم صغير: 2 ريال", price: 5, image: "" },
      { name: "صوص اللوز", desc: "حجم صغير: 5 ريال", price: 15, image: "" },
      { name: "صوص السمبل", desc: "حجم صغير: 5 ريال", price: 15, image: "" },
      { name: "مشروبات غازية", desc: "", price: 3, image: "" },
      { name: "كركديه", desc: "", price: 5, image: "" },
      { name: "آيس تي", desc: "", price: 5, image: "" },
      { name: "ماء", desc: "", price: 1, image: "" },
    ],
  },
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function SateBMenu() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const sectionRefs = useRef({});

  // Load Google Fonts once
  useEffect(() => {
    if (document.getElementById("sate-b-fonts")) return;
    const link = document.createElement("link");
    link.id = "sate-b-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Tajawal:wght@300;400;500;700;900&display=swap";
    document.head.appendChild(link);
  }, []);

  // Track scroll position to highlight active nav item
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      for (const cat of CATEGORIES) {
        const el = sectionRefs.current[cat.id];
        if (el && el.offsetTop <= scrollPos && el.offsetTop + el.offsetHeight > scrollPos) {
          setActiveCategory(cat.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToCategory = (id) => {
    const el = sectionRefs.current[id];
    if (el) {
      const top = el.offsetTop - 110;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  // Filter items by search query
  const filterItems = (items) => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.trim();
    return items.filter(
      (item) => item.name.includes(q) || item.desc.includes(q)
    );
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#FDF6EC]"
      style={{ fontFamily: "'Cairo', 'Tajawal', sans-serif" }}
    >
      {/* ─── Header / Hero ───────────────────────────────────────────── */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#2C1810] via-[#4A1C12] to-[#96281B] text-white">
        {/* Decorative pattern overlay */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(243,156,18,0.4) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Golden corner ornaments */}
        <div className="absolute top-4 right-4 w-20 h-20 border-t-2 border-r-2 border-[#F39C12] opacity-40 rounded-tr-xl" />
        <div className="absolute bottom-4 left-4 w-20 h-20 border-b-2 border-l-2 border-[#F39C12] opacity-40 rounded-bl-xl" />

        <div className="relative px-6 pt-10 pb-12 text-center max-w-2xl mx-auto">
          {/* Logo badge */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white shadow-2xl mb-5 ring-4 ring-[#F39C12]/30">
            <div className="text-center leading-none">
              <div className="text-3xl font-black text-[#C0392B] tracking-wide">
                SATE
              </div>
              <div className="inline-block px-2 mt-1 bg-[#C0392B] text-white text-2xl font-black rounded">
                B
              </div>
              <div
                className="text-[10px] text-[#C0392B] font-bold mt-1"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                ساتي بي
              </div>
            </div>
          </div>

          <h1
            className="text-5xl font-black mb-2 tracking-tight"
            style={{
              background: "linear-gradient(135deg, #FFD89B 0%, #F39C12 50%, #E67E22 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ساتي بي
          </h1>
          <div className="text-xs text-white/50 tracking-[0.4em] font-light mb-3">
            SATE B
          </div>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#F39C12]" />
            <span className="text-[#F39C12] text-lg">✦</span>
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#F39C12]" />
          </div>

          <p className="text-base text-white/80 italic font-light">
            "الطعم الأصلي للساتي"
          </p>
          <p className="text-[11px] text-white/50 mt-1 tracking-wider">
            THE ORIGINAL TASTE OF SATAY
          </p>

          {/* Quick info pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <span className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-xs border border-white/20">
              🇮🇩 مطبخ إندونيسي
            </span>
            <span className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-xs border border-white/20">
              📍 جدة
            </span>
            <span className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-xs border border-white/20">
              🔥 طازج يومياً
            </span>
          </div>
        </div>
      </header>

      {/* ─── Sticky Category Nav ─────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#2C1810] border-b-2 border-[#E67E22] shadow-lg">
        <div className="max-w-2xl mx-auto">
          <div
            className="flex overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}`}</style>
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`relative flex-shrink-0 px-4 py-4 text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? "text-[#F39C12]"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  <span className="text-lg ml-1">{cat.icon}</span>
                  {cat.name}
                  {isActive && (
                    <span className="absolute bottom-0 right-3 left-3 h-0.5 bg-gradient-to-r from-[#E67E22] to-[#F39C12] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ─── Search Bar ──────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 pt-5">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن طبق..."
            className="w-full bg-white border-2 border-[#C0392B]/15 rounded-2xl py-3 pr-12 pl-4 text-[#3D1F14] placeholder-[#7D5A4F] focus:outline-none focus:border-[#E67E22] focus:ring-4 focus:ring-[#F39C12]/15 transition-all shadow-sm"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          />
          <span className="absolute top-1/2 right-4 -translate-y-1/2 text-[#C0392B] text-xl">
            🔍
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-[#7D5A4F] hover:text-[#C0392B] transition-colors w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#FDF6EC]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ─── Menu Sections ───────────────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-4 pt-6 pb-12">
        {CATEGORIES.map((cat) => {
          const filteredItems = filterItems(cat.items);
          if (filteredItems.length === 0 && searchQuery) return null;

          // Layout A: full-width hero image above item list (mixed + satay)
          const isLayoutA = cat.id === "mixed" || cat.id === "satay";
          // Layout B: two-column grid with tall sticky image (main + extras)
          const isLayoutB = cat.id === "main" || cat.id === "extras";

          const heroSrc =
            cat.id === "mixed" ? "/images/mixed-meals-hero.png" :
            cat.id === "satay" ? "/images/satay-hero.png" : null;

          const tallSrc =
            cat.id === "main" ? "/images/main-sides-tall.png" :
            cat.id === "extras" ? "/images/extras-tall.png" : null;

          return (
            <section
              key={cat.id}
              ref={(el) => (sectionRefs.current[cat.id] = el)}
              className="mb-10 scroll-mt-24"
            >
              {/* Section Header */}
              <div className="relative mb-6 text-center">
                <div className="inline-block">
                  <div className="text-4xl mb-2">{cat.icon}</div>
                  <h2 className="text-2xl font-black text-[#3D1F14] mb-1">
                    {cat.name}
                  </h2>
                  <div className="text-[10px] tracking-[0.3em] text-[#C0392B] font-bold">
                    {cat.nameEn.toUpperCase()}
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <div className="h-px w-10 bg-[#E67E22]" />
                    <span className="text-[#F39C12] text-xs">✦</span>
                    <div className="h-px w-10 bg-[#E67E22]" />
                  </div>
                </div>
              </div>

              {/* ─── Layout A: Hero banner + vertical list ───────────── */}
              {isLayoutA && (
                <>
                  <img
                    src={heroSrc}
                    alt={cat.name}
                    className="w-full h-48 md:h-64 object-cover rounded-2xl shadow-md mb-6 bg-white"
                  />
                  <div className="space-y-3">
                    {filteredItems.map((item, idx) => (
                      <MenuItemCard key={`${cat.id}-${idx}`} item={item} />
                    ))}
                  </div>
                </>
              )}

              {/* ─── Layout B: 12-col grid with tall sticky image ────── */}
              {isLayoutB && (
                <div className="grid grid-cols-12 gap-4">
                  {/* Right column (text/items) — col-span-8, naturally on the right in RTL */}
                  <div className="col-span-8 space-y-3">
                    {filteredItems.map((item, idx) => (
                      <MenuItemCard key={`${cat.id}-${idx}`} item={item} />
                    ))}
                  </div>
                  {/* Left column (tall composite image) — col-span-4 */}
                  <div className="col-span-4">
                    <img
                      src={tallSrc}
                      alt={cat.name}
                      className="w-full h-full object-contain sticky top-24"
                    />
                  </div>
                </div>
              )}
            </section>
          );
        })}

        {/* No results state */}
        {searchQuery &&
          CATEGORIES.every((cat) => filterItems(cat.items).length === 0) && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-[#3D1F14] font-bold text-lg">
                لم يتم العثور على نتائج
              </p>
              <p className="text-[#7D5A4F] text-sm mt-2">
                جرّب البحث بكلمة أخرى
              </p>
            </div>
          )}
      </main>

      {/* ─── Footer ──────────────────────────────────────────────────── */}
      <footer className="relative bg-gradient-to-br from-[#2C1810] via-[#4A1C12] to-[#96281B] text-white pt-10 pb-8 px-6 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(243,156,18,0.6) 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative max-w-2xl mx-auto text-center">
          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#F39C12]" />
            <span className="text-[#F39C12] text-xl">✦</span>
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#F39C12]" />
          </div>

          {/* Takeout Number — Call CTA */}
          <div className="mb-7">
            <p className="text-[11px] tracking-[0.3em] text-[#F39C12] font-bold mb-2">
              FOR TAKEAWAY ORDERS
            </p>
            <p className="text-sm text-white/70 mb-3">للطلبات الخارجية</p>
            <a
              href="tel:0503760010"
              className="inline-flex items-center gap-3 bg-gradient-to-l from-[#E67E22] to-[#F39C12] text-white px-6 py-3 rounded-full font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-transform"
              dir="ltr"
            >
              <span>📞</span>
              <span className="tracking-wider">0503760010</span>
            </a>
          </div>

          {/* Social */}
          <div className="mb-6">
            <p className="text-xs text-white/60 mb-3">تابعنا على</p>
            <div className="flex items-center justify-center gap-3 text-2xl">
              <a
                href="https://instagram.com/sate_b20"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#F39C12] flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm border border-white/10"
                aria-label="Instagram"
              >
                📸
              </a>
              <a
                href="https://twitter.com/sate_b20"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#F39C12] flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm border border-white/10"
                aria-label="Twitter"
              >
                🐦
              </a>
              <a
                href="https://tiktok.com/@sate_b20"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#F39C12] flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm border border-white/10"
                aria-label="TikTok"
              >
                🎵
              </a>
            </div>
            <p
              className="mt-3 text-[#F39C12] font-bold tracking-wider"
              dir="ltr"
            >
              @sate_b20
            </p>
          </div>

          {/* Brand line */}
          <div className="pt-5 border-t border-white/10">
            <p className="text-base font-bold text-white/90">ساتي بي</p>
            <p className="text-[10px] text-white/40 tracking-[0.4em] mt-1">
              SATE B · JEDDAH
            </p>
            <p className="text-[10px] text-white/40 mt-4 italic">
              "الطعم الأصلي للساتي"
            </p>
          </div>

          {/* Credit (subtle) */}
          <p className="text-[9px] text-white/25 mt-6 tracking-wider">
            DIGITAL MENU · CPIT-380 COMMUNITY SERVICE PROJECT
          </p>
        </div>
      </footer>
    </div>
  );
}

// ─── Menu Item Card ──────────────────────────────────────────────────────────
function MenuItemCard({ item }) {
  const hasImage = item.image && item.image.length > 0;

  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border ${
        item.featured
          ? "border-[#F39C12]/40 ring-2 ring-[#F39C12]/15"
          : "border-[#C0392B]/8 hover:border-[#E67E22]/30"
      }`}
    >
      {/* Featured badge floats on card so it shows with or without an image */}
      {item.featured && (
        <div className="absolute top-2 left-2 z-10 bg-[#F39C12] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md">
          ⭐ مميز
        </div>
      )}

      <div className="flex items-stretch">
        {/* Image column — only rendered if the item actually has an image */}
        {hasImage && (
          <div className="relative w-28 h-28 flex-shrink-0 overflow-hidden bg-gradient-to-br from-[#FDF6EC] to-[#FEEAD0]">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        )}

        {/* Content — fills the full width when there is no image */}
        <div className="flex-1 p-4 flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-black text-[#3D1F14] leading-tight mb-1">
              {item.name}
            </h3>
            {item.desc && (
              <p className="text-xs text-[#7D5A4F] leading-relaxed">
                {item.desc}
              </p>
            )}
          </div>

          {/* Price badge */}
          <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
            <span className="inline-flex items-center justify-center bg-gradient-to-l from-[#C0392B] to-[#E74C3C] text-white font-black text-lg px-4 py-1 rounded-full shadow-md min-w-[60px]">
              {item.price}
            </span>
            <span className="text-[10px] text-[#7D5A4F] font-bold">ريال</span>
          </div>
        </div>
      </div>
    </div>
  );
}

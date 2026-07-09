"""
VOCCSYS product brochure generator.

Run:  python scripts/generate_brochure.py
Output: /app/frontend/public/voccsys-brochure.pdf
"""
from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame,
    Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, Flowable,
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from datetime import datetime

# ============ Theme ============
COPPER      = colors.HexColor("#B45309")
COPPER_DARK = colors.HexColor("#92400E")
CONCRETE    = colors.HexColor("#F2F1ED")
INK         = colors.HexColor("#1F1F22")
INK_2       = colors.HexColor("#3D3F3E")
MUTED       = colors.HexColor("#6B6E6C")
BORDER      = colors.HexColor("#D9D6CE")
WHITE       = colors.white

FONT_BODY = "Helvetica"
FONT_BOLD = "Helvetica-Bold"
FONT_MONO = "Courier"

# ============ Vector loop diagram ============
class LoopDiagram(Flowable):
    """Closed-loop sponge-ball circulation diagram drawn as vectors."""

    def __init__(self, width=170 * mm, height=70 * mm):
        Flowable.__init__(self)
        self.width = width
        self.height = height

    def wrap(self, aw, ah):
        return self.width, self.height

    def draw(self):
        c = self.canv
        w, h = self.width, self.height

        # ==== Condenser shell (dashed outline) ====
        c.setDash(3, 3)
        c.setStrokeColor(BORDER)
        c.setLineWidth(0.5)
        c.rect(8 * mm, 12 * mm, w - 16 * mm, h - 20 * mm, stroke=1, fill=0)
        c.setDash()  # reset

        # ==== Inlet / Outlet header blocks ====
        c.setFillColor(colors.HexColor("#2E2E38"))
        c.setStrokeColor(colors.HexColor("#4A4A55"))
        c.setLineWidth(0.4)
        c.rect(10 * mm, 20 * mm, 5 * mm, h - 32 * mm, fill=1, stroke=1)
        c.rect(w - 15 * mm, 20 * mm, 5 * mm, h - 32 * mm, fill=1, stroke=1)

        # Header labels
        c.setFont(FONT_MONO, 6)
        c.setFillColor(MUTED)
        c.drawCentredString(12.5 * mm, h - 10 * mm, "INLET")
        c.drawCentredString(w - 12.5 * mm, h - 10 * mm, "OUTLET")
        c.drawString(10 * mm, 4 * mm, "CONDENSER SHELL — TUBE BUNDLE")

        # ==== Tubes ====
        tube_count = 5
        top = h - 18 * mm
        bottom = 24 * mm
        span = top - bottom
        tube_y_positions = [bottom + i * (span / (tube_count - 1)) for i in range(tube_count)]
        c.setFillColor(colors.HexColor("#DDD9CB"))
        c.setStrokeColor(colors.HexColor("#B0AC9E"))
        c.setLineWidth(0.4)
        for ty in tube_y_positions:
            c.rect(15 * mm, ty - 1.6 * mm, w - 30 * mm, 3.2 * mm, fill=1, stroke=1)

        # ==== Balls on tubes ====
        c.setFillColor(COPPER)
        c.setStrokeColor(COPPER)
        import random
        random.seed(3)
        for i, ty in enumerate(tube_y_positions):
            # 1–2 balls per tube at random-ish x offset
            base_x = 22 + (i * 15) % 100
            for j in range(2):
                bx = 15 * mm + (base_x + j * 55) * mm / 3.2
                if bx < w - 18 * mm:
                    c.circle(bx, ty, 1.2 * mm, fill=1, stroke=0)

        # ==== Recirculation loop path (bottom curved return) ====
        c.setStrokeColor(colors.HexColor("#B0AC9E"))
        c.setLineWidth(3.4)
        c.setLineCap(1)  # round
        c.setDash()
        # Right outlet → down → across → up to inlet
        p = c.beginPath()
        p.moveTo(w - 12.5 * mm, 22 * mm)
        p.curveTo(w - 4 * mm, 22 * mm, w - 4 * mm, 14 * mm, w - 14 * mm, 14 * mm)
        p.lineTo(14 * mm, 14 * mm)
        p.curveTo(4 * mm, 14 * mm, 4 * mm, 22 * mm, 12.5 * mm, 22 * mm)
        c.drawPath(p, stroke=1, fill=0)

        # Copper dashed overlay on return path (accent)
        c.setStrokeColor(COPPER)
        c.setLineWidth(0.6)
        c.setDash(2, 2)
        p2 = c.beginPath()
        p2.moveTo(w - 12.5 * mm, 22 * mm)
        p2.curveTo(w - 4 * mm, 22 * mm, w - 4 * mm, 14 * mm, w - 14 * mm, 14 * mm)
        p2.lineTo(14 * mm, 14 * mm)
        p2.curveTo(4 * mm, 14 * mm, 4 * mm, 22 * mm, 12.5 * mm, 22 * mm)
        c.drawPath(p2, stroke=1, fill=0)
        c.setDash()

        # ==== Balls on return path ====
        c.setFillColor(COPPER)
        for i, x in enumerate([w - 30 * mm, w - 55 * mm, w / 2, 55 * mm, 30 * mm]):
            c.circle(x, 14 * mm, 1.0 * mm, fill=1, stroke=0)

        # ==== Collector & Pump icons ====
        c.setFillColor(CONCRETE)
        c.setStrokeColor(COPPER)
        c.setLineWidth(0.8)
        # Collector on right
        c.circle(w - 4 * mm, 14 * mm, 2.5 * mm, fill=1, stroke=1)
        c.setFont(FONT_MONO, 5.5)
        c.setFillColor(MUTED)
        c.drawCentredString(w - 4 * mm, 8 * mm, "COLLECTOR")
        # Pump on left
        c.setFillColor(CONCRETE)
        c.setStrokeColor(COPPER)
        c.rect(1.5 * mm, 11.5 * mm, 5 * mm, 5 * mm, fill=1, stroke=1)
        c.setFillColor(MUTED)
        c.drawCentredString(4 * mm, 8 * mm, "PUMP")

        # ==== Flow direction labels ====
        c.setFont(FONT_MONO, 6.5)
        c.setFillColor(MUTED)
        c.drawCentredString(w / 2, h - 4 * mm, "→ COOLING WATER + SPONGE BALLS →")
        c.drawCentredString(w / 2, 18 * mm, "← RECIRCULATION LOOP ←")


# ============ Styles ============
def make_styles():
    return {
        "h1": ParagraphStyle(
            "h1", fontName=FONT_BOLD, fontSize=42, leading=42,
            textColor=INK, spaceAfter=6, letterSpacing=-1.2,
        ),
        "h1_accent": ParagraphStyle(
            "h1_accent", fontName=FONT_BOLD, fontSize=42, leading=42,
            textColor=COPPER, spaceAfter=18, letterSpacing=-1.2,
        ),
        "h2": ParagraphStyle(
            "h2", fontName=FONT_BOLD, fontSize=22, leading=26,
            textColor=INK, spaceAfter=8,
        ),
        "h3": ParagraphStyle(
            "h3", fontName=FONT_BOLD, fontSize=13, leading=16,
            textColor=INK, spaceAfter=4,
        ),
        "overline": ParagraphStyle(
            "overline", fontName=FONT_MONO, fontSize=8.5, leading=11,
            textColor=COPPER, spaceAfter=10, letterSpacing=2,
        ),
        "body": ParagraphStyle(
            "body", fontName=FONT_BODY, fontSize=10.5, leading=15.5,
            textColor=INK_2, spaceAfter=8,
        ),
        "body_small": ParagraphStyle(
            "body_small", fontName=FONT_BODY, fontSize=9.5, leading=13.5,
            textColor=INK_2,
        ),
        "muted": ParagraphStyle(
            "muted", fontName=FONT_BODY, fontSize=8.5, leading=12,
            textColor=MUTED,
        ),
        "stat_num": ParagraphStyle(
            "stat_num", fontName=FONT_BOLD, fontSize=26, leading=28,
            textColor=INK, letterSpacing=-1,
        ),
        "stat_lab": ParagraphStyle(
            "stat_lab", fontName=FONT_MONO, fontSize=7.5, leading=10,
            textColor=MUTED, letterSpacing=1.4,
        ),
        "footer": ParagraphStyle(
            "footer", fontName=FONT_MONO, fontSize=7.5, leading=10,
            textColor=MUTED,
        ),
    }


# ============ Page decorations ============
def draw_page_frame(canv, doc):
    """Draw the concrete off-white page + brand header/footer bar."""
    w, h = A4
    canv.saveState()

    # Page background
    canv.setFillColor(CONCRETE)
    canv.rect(0, 0, w, h, stroke=0, fill=1)

    # Top brand bar
    canv.setFillColor(COPPER)
    canv.rect(20 * mm, h - 15 * mm, 3 * mm, 8 * mm, stroke=0, fill=1)

    canv.setFont(FONT_BOLD, 12)
    canv.setFillColor(INK)
    canv.drawString(25 * mm, h - 11 * mm, "VOCCSYS")
    canv.setFont(FONT_MONO, 7.5)
    canv.setFillColor(MUTED)
    canv.drawString(56 * mm, h - 11 * mm, "BY VULCAN INDUSTRIES INDIA")

    # Right side: page number
    page_num = canv.getPageNumber()
    canv.setFont(FONT_MONO, 7.5)
    canv.setFillColor(MUTED)
    canv.drawRightString(w - 20 * mm, h - 11 * mm, f"P. {page_num:02d}")

    # Thin top rule
    canv.setStrokeColor(BORDER)
    canv.setLineWidth(0.4)
    canv.line(20 * mm, h - 17 * mm, w - 20 * mm, h - 17 * mm)

    # Bottom rule + footer
    canv.line(20 * mm, 17 * mm, w - 20 * mm, 17 * mm)
    canv.setFont(FONT_MONO, 7)
    canv.setFillColor(MUTED)
    canv.drawString(20 * mm, 12 * mm, "VOCCSYS · Vulcan Online Condenser Cleaning System")
    canv.drawRightString(w - 20 * mm, 12 * mm, "contactus@vulcanindustriesindia.com")

    canv.restoreState()


def draw_cover_frame(canv, doc):
    """Bolder cover page with copper block."""
    w, h = A4
    canv.saveState()
    # Page bg
    canv.setFillColor(CONCRETE)
    canv.rect(0, 0, w, h, stroke=0, fill=1)

    # Large copper block on right
    canv.setFillColor(COPPER)
    canv.rect(w - 55 * mm, 0, 55 * mm, h, stroke=0, fill=1)

    # Brand mark top-left
    canv.setFillColor(COPPER)
    canv.rect(20 * mm, h - 30 * mm, 4 * mm, 14 * mm, stroke=0, fill=1)
    canv.setFillColor(INK)
    canv.setFont(FONT_BOLD, 18)
    canv.drawString(28 * mm, h - 22 * mm, "VOCCSYS")
    canv.setFont(FONT_MONO, 8)
    canv.setFillColor(MUTED)
    canv.drawString(28 * mm, h - 28 * mm, "BY VULCAN INDUSTRIES INDIA")

    # Rotated white text on copper block
    canv.setFillColor(WHITE)
    canv.setFont(FONT_MONO, 8)
    canv.saveState()
    canv.translate(w - 12 * mm, 30 * mm)
    canv.rotate(90)
    canv.drawString(0, 0, "PATENTED · ONLINE CONDENSER CLEANING · ZERO SHUTDOWN")
    canv.restoreState()

    # Footer strip
    canv.setStrokeColor(BORDER)
    canv.setLineWidth(0.4)
    canv.line(20 * mm, 22 * mm, w - 60 * mm, 22 * mm)
    canv.setFont(FONT_MONO, 7.5)
    canv.setFillColor(MUTED)
    canv.drawString(20 * mm, 17 * mm, "PRODUCT BROCHURE · " + datetime.utcnow().strftime("%B %Y").upper())
    canv.drawString(20 * mm, 12 * mm, "voccsys.com")

    canv.restoreState()


# ============ Content builders ============
def build_cover(st):
    story = []
    story.append(Spacer(1, 55 * mm))
    story.append(Paragraph("PRODUCT BROCHURE / VCS-SERIES", st["overline"]))
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("Clean condensers", st["h1"]))
    story.append(Paragraph("while the plant runs.", st["h1_accent"]))
    story.append(Spacer(1, 8 * mm))
    story.append(Paragraph(
        "VOCCSYS is Vulcan Industries&#8217; patented Online Condenser Cleaning "
        "System &#8212; a continuous sponge-ball circulation loop that scrubs scale "
        "and biofilm from every condenser tube while the plant remains in "
        "operation. Zero shutdown. Zero chemicals. Measurable heat rate recovery.",
        st["body"],
    ))
    story.append(Spacer(1, 12 * mm))

    # Stat row on cover
    stat_row = Table(
        [[
            Paragraph("0<font size=13 color='#B45309'> hrs</font>", st["stat_num"]),
            Paragraph("1&#8211;3<font size=13 color='#B45309'>%</font>", st["stat_num"]),
            Paragraph("&lt;12<font size=13 color='#B45309'> mo</font>", st["stat_num"]),
        ],
        [
            Paragraph("SHUTDOWN REQUIRED", st["stat_lab"]),
            Paragraph("HEAT RATE RECOVERY", st["stat_lab"]),
            Paragraph("TYPICAL PAYBACK", st["stat_lab"]),
        ]],
        colWidths=[40 * mm, 40 * mm, 40 * mm],
        rowHeights=[14 * mm, 8 * mm],
    )
    stat_row.setStyle(TableStyle([
        ("LINEABOVE", (0, 0), (-1, 0), 0.6, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, 0), 4),
    ]))
    story.append(stat_row)
    story.append(PageBreak())
    return story


def build_overview(st):
    s = []
    s.append(Paragraph("&#8212; 01 / THE SYSTEM", st["overline"]))
    s.append(Paragraph("Fouling is silent.", st["h2"]))
    s.append(Paragraph("<font color='#B45309'>So is our fix.</font>", st["h2"]))
    s.append(Spacer(1, 4 * mm))
    s.append(Paragraph(
        "In every condenser, thin layers of scale, algae and biofilm form on the "
        "inner tube walls. You can&#8217;t see it &#8212; but you pay for it. Every "
        "micron of fouling degrades heat transfer, silently forcing higher back-"
        "pressure, higher fuel burn and quiet losses that add up to crores of rupees "
        "each year.",
        st["body"],
    ))
    s.append(Paragraph(
        "VOCCSYS eliminates it &#8212; continuously, mechanically, and without ever "
        "stopping your plant. Cleaning sponge balls circulate through every tube on "
        "every pass, scrubbing surfaces back to a mirror finish and keeping them "
        "there.",
        st["body"],
    ))

    # Three-pillar row
    pill = [
        ("CONTINUOUS", "Runs 24&#215;7 with your condenser &#8212; no offline windows."),
        ("MECHANICAL", "No chemicals, no additives, no environmental risk."),
        ("PROVEN",     "Deployed across power, HVAC, refining and steel plants."),
    ]
    cells = []
    for t, d in pill:
        cells.append([
            Paragraph(f"<b>{t}</b>", st["h3"]),
            Paragraph(d, st["body_small"]),
        ])
    row = Table([[c[0] for c in cells], [c[1] for c in cells]], colWidths=[55 * mm] * 3)
    row.setStyle(TableStyle([
        ("LINEABOVE", (0, 0), (-1, 0), 0.6, COPPER),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, 0), 6),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 2),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    s.append(Spacer(1, 4 * mm))
    s.append(row)
    s.append(Spacer(1, 8 * mm))
    return s


def build_process(st):
    s = []
    s.append(Paragraph("&#8212; 02 / HOW IT WORKS", st["overline"]))
    s.append(Paragraph("A closed loop.", st["h2"]))
    s.append(Paragraph("<font color='#B45309'>Cleaning without pause.</font>", st["h2"]))
    s.append(Spacer(1, 4 * mm))

    # Vector diagram
    s.append(LoopDiagram(width=170 * mm, height=62 * mm))
    s.append(Spacer(1, 5 * mm))

    steps = [
        ("01", "INJECT",       "Sponge balls (slightly oversized vs tube ID) are injected into the cooling water inlet header via the VOCCSYS ball trap."),
        ("02", "SCRUB",        "Balls flow through every condenser tube with the water, wiping the internal surface clean of scale and biofilm on every pass."),
        ("03", "COLLECT",      "A downstream strainer captures 100% of the balls after the condenser without disturbing water flow."),
        ("04", "RECIRCULATE",  "The recovery pump re-injects the collected balls back to the inlet, forming a closed, continuous cleaning loop."),
    ]

    rows = []
    for n, t, d in steps:
        rows.append([
            Paragraph(f"<font color='#B45309'><b>{n}</b></font>", st["h3"]),
            Paragraph(f"<b>{t}</b>", st["h3"]),
            Paragraph(d, st["body_small"]),
        ])
    tbl = Table(rows, colWidths=[15 * mm, 35 * mm, 120 * mm])
    tbl.setStyle(TableStyle([
        ("LINEABOVE", (0, 0), (-1, 0), 0.4, BORDER),
        ("LINEBELOW", (0, 0), (-1, -1), 0.4, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ]))
    s.append(tbl)
    s.append(Spacer(1, 8 * mm))
    return s


def build_roi(st):
    s = []
    s.append(Paragraph("&#8212; 03 / ROI &amp; BENEFITS", st["overline"]))
    s.append(Paragraph("Numbers that survive the finance meeting.", st["h2"]))
    s.append(Spacer(1, 4 * mm))
    s.append(Paragraph(
        "The value of VOCCSYS is neither theoretical nor marginal &#8212; it is "
        "measurable at the main condenser vacuum, at the turbine heat rate, and on "
        "your fuel invoice.",
        st["body"],
    ))

    # 4 big metrics
    metrics = [
        ("1&#8211;3%", "HEAT RATE IMPROVEMENT",   "Continuous, measurable at the turbine."),
        ("6&#8211;12 mo", "TYPICAL PAYBACK PERIOD",  "Across most large condensers."),
        ("40&#8211;60%", "REDUCTION IN FOULING LOSSES", "Vs. offline mechanical cleaning cycles."),
        ("24/7",        "UNINTERRUPTED OPERATION", "Zero shutdown, zero production loss."),
    ]
    m_rows = []
    for n, l, d in metrics:
        m_rows.append([
            Paragraph(n, st["stat_num"]),
            Paragraph(l, st["stat_lab"]),
            Paragraph(d, st["muted"]),
        ])
    m_tbl = Table(m_rows, colWidths=[35 * mm, 55 * mm, 80 * mm])
    m_tbl.setStyle(TableStyle([
        ("LINEBELOW", (0, 0), (-1, -1), 0.4, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ]))
    s.append(m_tbl)
    s.append(Spacer(1, 6 * mm))

    # Benefits grid (6 items)
    benefits = [
        ("Lower fuel &amp; auxiliary power",
         "A cleaner condenser drops back-pressure &#8212; every percentage point of vacuum recovered translates directly to fuel savings."),
        ("Stable heat rate",
         "No more sawtooth degradation between shutdowns. Performance stays flat at design conditions."),
        ("No production loss",
         "Cleaning happens with the plant running. Skip the offline cleaning windows entirely."),
        ("Zero chemicals",
         "Fully mechanical scrubbing. No biocides, no acids, no environmental discharge concerns."),
        ("Extends tube life",
         "Prevents pitting, under-deposit corrosion and biofouling &#8212; protecting your capital equipment."),
        ("Retrofit-ready",
         "Designed to be installed on existing condensers with minimal piping modifications."),
    ]
    b_rows = []
    for i in range(0, len(benefits), 2):
        a, b = benefits[i], benefits[i + 1] if i + 1 < len(benefits) else ("", "")
        b_rows.append([
            [Paragraph(f"<b>{a[0]}</b>", st["h3"]), Paragraph(a[1], st["body_small"])],
            [Paragraph(f"<b>{b[0]}</b>", st["h3"]), Paragraph(b[1], st["body_small"])],
        ])
    b_tbl = Table(b_rows, colWidths=[85 * mm, 85 * mm])
    b_tbl.setStyle(TableStyle([
        ("LINEABOVE", (0, 0), (-1, 0), 0.4, BORDER),
        ("LINEBELOW", (0, 0), (-1, -1), 0.4, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
    ]))
    s.append(b_tbl)
    return s


def build_specs(st):
    s = []
    s.append(Paragraph("&#8212; 04 / TECHNICAL SPECIFICATIONS", st["overline"]))
    s.append(Paragraph("Engineered to your condenser, not the other way around.", st["h2"]))
    s.append(Spacer(1, 3 * mm))
    s.append(Paragraph(
        "Every VOCCSYS unit is sized against your condenser&#8217;s tube geometry, "
        "water chemistry and operating envelope. Below is a representative baseline.",
        st["body"],
    ))
    s.append(Spacer(1, 4 * mm))

    def make_spec_table(title, rows):
        title_p = Paragraph(f"<b>{title}</b>", st["h3"])
        body_rows = []
        for k, v in rows:
            body_rows.append([
                Paragraph(k, st["body_small"]),
                Paragraph(v, ParagraphStyle(
                    "v", parent=st["body_small"], fontName=FONT_MONO, textColor=INK)),
            ])
        body = Table(body_rows, colWidths=[40 * mm, 130 * mm])
        body.setStyle(TableStyle([
            ("LINEBELOW", (0, 0), (-1, -1), 0.3, BORDER),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ]))
        return [title_p, Spacer(1, 2 * mm), body, Spacer(1, 6 * mm)]

    groups = [
        ("CONFIGURATION", [
            ("Model range",         "VCS-500 / VCS-1000 / VCS-2000 / Custom"),
            ("Ball injection type", "Continuous / batch programmable"),
            ("Tube ID compatibility", "18 mm – 32 mm"),
            ("Tube materials",      "SS 304 / 316L, Titanium, Cu-Ni, Admiralty Brass"),
        ]),
        ("SPONGE BALLS", [
            ("Base material", "Natural rubber / EPDM foam"),
            ("Ball grades",   "Standard, Abrasive, Extra-abrasive"),
            ("Density",       "Marginally < cooling water"),
            ("Typical life",  "1,500 – 3,000 hours per lot"),
        ]),
        ("SYSTEM", [
            ("Control",       "PLC + HMI, remote SCADA-ready"),
            ("Ball recovery", "100% via mesh strainer / basket type"),
            ("Piping",        "MS / SS with rubber lining, ANSI B16.5 flanges"),
            ("Power supply",  "415 V, 3φ, 50 Hz (customisable)"),
        ]),
        ("COMPLIANCE", [
            ("Design code",     "TEMA / HEI aligned"),
            ("Instrumentation", "ΔP, flow, turbidity, ball count sensors"),
            ("Documentation",   "GA drawings, PID, IOM, O&M manual"),
            ("Warranty",        "12 months from commissioning"),
        ]),
    ]

    for name, rows in groups:
        s.extend(make_spec_table(name, rows))
    return s


def build_industries_contact(st):
    s = []
    s.append(Paragraph("&#8212; 05 / INDUSTRIES SERVED", st["overline"]))
    s.append(Paragraph("Wherever tubes foul, VOCCSYS pays back.", st["h2"]))
    s.append(Spacer(1, 4 * mm))

    industries = [
        ("Thermal & Nuclear Power",   "Main and auxiliary condensers, closed-cycle cooling.",  "500 MW+"),
        ("HVAC & District Cooling",   "Large chiller condensers in commercial and campus deployments.", "5000+ TR"),
        ("Petrochemical & Refining",  "Overhead condensers and heat exchangers in critical service.",   "24×7"),
        ("Steel & Metals",            "Blast furnace, rolling mill and continuous casting cooling.",    "RETROFIT"),
        ("Sugar & Paper",             "Vapour condensers and process heat exchangers.",                  "SEASONAL"),
        ("Chemical & Fertilizer",     "Process condensers with challenging water chemistry.",            "CORROSIVE"),
    ]
    i_rows = []
    for name, desc, tag in industries:
        i_rows.append([
            Paragraph(f"<b>{name}</b>", st["h3"]),
            Paragraph(desc, st["body_small"]),
            Paragraph(f"<font color='#B45309'><b>{tag}</b></font>", st["stat_lab"]),
        ])
    i_tbl = Table(i_rows, colWidths=[55 * mm, 95 * mm, 20 * mm])
    i_tbl.setStyle(TableStyle([
        ("LINEBELOW", (0, 0), (-1, -1), 0.4, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
    ]))
    s.append(i_tbl)

    s.append(Spacer(1, 12 * mm))
    s.append(Paragraph("&#8212; 06 / CONTACT", st["overline"]))
    s.append(Paragraph("Send us your condenser. We&#8217;ll size a system.", st["h2"]))
    s.append(Spacer(1, 3 * mm))
    s.append(Paragraph(
        "Share your plant details and one of our engineers will get back with a "
        "tailored technical proposal &#8212; typically within 2 working days.",
        st["body"],
    ))
    s.append(Spacer(1, 4 * mm))

    contact_rows = [
        [Paragraph("EMAIL", st["stat_lab"]),   Paragraph("contactus@vulcanindustriesindia.com", st["body_small"])],
        [Paragraph("WEB",   st["stat_lab"]),   Paragraph("voccsys.com", st["body_small"])],
        [Paragraph("COMPANY", st["stat_lab"]), Paragraph("Vulcan Industries India", st["body_small"])],
    ]
    c_tbl = Table(contact_rows, colWidths=[25 * mm, 145 * mm])
    c_tbl.setStyle(TableStyle([
        ("LINEBELOW", (0, 0), (-1, -1), 0.3, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ]))
    s.append(c_tbl)
    return s


# ============ Main ============
def generate(output_path: Path):
    output_path.parent.mkdir(parents=True, exist_ok=True)
    st = make_styles()

    doc = BaseDocTemplate(
        str(output_path),
        pagesize=A4,
        title="VOCCSYS — Product Brochure",
        author="Vulcan Industries India",
        subject="Vulcan Online Condenser Cleaning System",
        keywords="VOCCSYS, condenser cleaning, sponge ball, heat rate, Vulcan Industries",
        leftMargin=20 * mm, rightMargin=20 * mm,
        topMargin=22 * mm, bottomMargin=22 * mm,
    )

    frame_cover = Frame(20 * mm, 22 * mm, A4[0] - 75 * mm, A4[1] - 44 * mm, id="cover")
    frame_body  = Frame(20 * mm, 22 * mm, A4[0] - 40 * mm, A4[1] - 44 * mm, id="body")

    doc.addPageTemplates([
        PageTemplate(id="cover", frames=[frame_cover], onPage=draw_cover_frame),
        PageTemplate(id="body",  frames=[frame_body],  onPage=draw_page_frame),
    ])

    story = []
    story.extend(build_cover(st))
    # Switch template
    story.append({"__nextTemplate__": "body"})

    # Since we can't dict-inject inline, use a proper NextPageTemplate flowable
    from reportlab.platypus.doctemplate import NextPageTemplate
    # Rebuild story properly:
    story = []
    story.append(NextPageTemplate("cover"))
    story.extend(build_cover(st))
    story.append(NextPageTemplate("body"))
    story.append(PageBreak())
    story.extend(build_overview(st))
    story.append(PageBreak())
    story.extend(build_process(st))
    story.append(PageBreak())
    story.extend(build_roi(st))
    story.append(PageBreak())
    story.extend(build_specs(st))
    story.append(PageBreak())
    story.extend(build_industries_contact(st))

    doc.build(story)


# =====================================================================
# ONE-PAGER — condensed 2-page procurement summary
# =====================================================================
def build_onepager_page1(st):
    s = []
    s.append(Paragraph("PRODUCT ONE-PAGER · " + datetime.utcnow().strftime("%B %Y").upper(), st["overline"]))
    s.append(Spacer(1, 3 * mm))
    s.append(Paragraph("Clean condensers", st["h2"]))
    s.append(Paragraph("<font color='#B45309'>while the plant runs.</font>", st["h2"]))
    s.append(Spacer(1, 3 * mm))
    s.append(Paragraph(
        "VOCCSYS is Vulcan Industries&#8217; patented online condenser cleaning "
        "system. A continuous sponge-ball circulation loop scrubs scale and "
        "biofilm from every tube while the plant remains in operation.",
        st["body_small"],
    ))
    s.append(Spacer(1, 4 * mm))

    # 4 headline metrics
    metrics = [
        ("0 hrs",   "SHUTDOWN"),
        ("1&#8211;3%",   "HEAT RATE"),
        ("&lt;12 mo","PAYBACK"),
        ("24/7",    "OPERATION"),
    ]
    m_cells = []
    for n, l in metrics:
        m_cells.append([
            Paragraph(f"<font color='#1F1F22'><b>{n}</b></font>",
                      ParagraphStyle("m", parent=st["stat_num"], fontSize=22, leading=24)),
            Paragraph(l, st["stat_lab"]),
        ])
    m_tbl = Table(
        [[c[0] for c in m_cells], [c[1] for c in m_cells]],
        colWidths=[42 * mm] * 4,
    )
    m_tbl.setStyle(TableStyle([
        ("LINEABOVE", (0, 0), (-1, 0), 0.6, COPPER),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, 0), 6),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 2),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ]))
    s.append(m_tbl)
    s.append(Spacer(1, 6 * mm))

    # Compact process diagram
    s.append(Paragraph("HOW IT WORKS", st["overline"]))
    s.append(Spacer(1, 2 * mm))
    s.append(LoopDiagram(width=170 * mm, height=52 * mm))
    s.append(Spacer(1, 3 * mm))

    steps = [
        ("01", "INJECT",      "Balls injected into cooling water inlet header."),
        ("02", "SCRUB",       "Balls flow through every tube, cleaning on every pass."),
        ("03", "COLLECT",     "Downstream strainer captures 100% of balls."),
        ("04", "RECIRCULATE", "Recovery pump re-injects balls for continuous loop."),
    ]
    rows = []
    for n, t, d in steps:
        rows.append([
            Paragraph(f"<font color='#B45309'><b>{n}</b></font>",
                      ParagraphStyle("n", parent=st["h3"], fontSize=10)),
            Paragraph(f"<b>{t}</b>",
                      ParagraphStyle("t", parent=st["h3"], fontSize=10)),
            Paragraph(d, st["body_small"]),
        ])
    tbl = Table(rows, colWidths=[10 * mm, 28 * mm, 132 * mm])
    tbl.setStyle(TableStyle([
        ("LINEBELOW", (0, 0), (-1, -1), 0.3, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ]))
    s.append(tbl)
    return s


def build_onepager_page2(st):
    s = []
    # 6 key benefits — two-column
    s.append(Paragraph("KEY BENEFITS", st["overline"]))
    s.append(Spacer(1, 3 * mm))
    benefits = [
        ("Lower fuel & auxiliary power", "Every % of vacuum recovered = direct fuel savings."),
        ("Stable heat rate",             "Flat performance at design conditions."),
        ("No production loss",           "Cleaning happens with the plant running."),
        ("Zero chemicals",               "Fully mechanical scrubbing. Zero discharge risk."),
        ("Extends tube life",            "Prevents pitting, under-deposit corrosion, biofouling."),
        ("Retrofit-ready",               "Installs on existing condensers with minimal piping mods."),
    ]
    b_rows = []
    for i in range(0, len(benefits), 2):
        a = benefits[i]
        b = benefits[i + 1] if i + 1 < len(benefits) else ("", "")
        b_rows.append([
            [Paragraph(f"<b>{a[0]}</b>", st["h3"]), Paragraph(a[1], st["body_small"])],
            [Paragraph(f"<b>{b[0]}</b>", st["h3"]), Paragraph(b[1], st["body_small"])],
        ])
    b_tbl = Table(b_rows, colWidths=[85 * mm, 85 * mm])
    b_tbl.setStyle(TableStyle([
        ("LINEABOVE", (0, 0), (-1, 0), 0.4, BORDER),
        ("LINEBELOW", (0, 0), (-1, -1), 0.4, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
    ]))
    s.append(b_tbl)
    s.append(Spacer(1, 8 * mm))

    # Quick spec block
    s.append(Paragraph("SPECIFICATIONS AT A GLANCE", st["overline"]))
    s.append(Spacer(1, 3 * mm))
    spec_rows = [
        ("Models",           "VCS-500 / VCS-1000 / VCS-2000 / Custom"),
        ("Tube ID range",    "18 mm – 32 mm"),
        ("Tube materials",   "SS 304 / 316L · Titanium · Cu-Ni · Admiralty Brass"),
        ("Ball material",    "Natural rubber / EPDM foam · Std / Abrasive / Extra-abrasive"),
        ("Ball recovery",    "100% via mesh strainer / basket type"),
        ("Control",          "PLC + HMI · SCADA-ready · ΔP / flow / turbidity / ball-count"),
        ("Design code",      "TEMA / HEI aligned · 12-month warranty from commissioning"),
        ("Power",            "415 V, 3φ, 50 Hz (customisable)"),
    ]
    spec_tbl = Table(
        [
            [Paragraph(k, st["body_small"]),
             Paragraph(v, ParagraphStyle("v", parent=st["body_small"],
                                         fontName=FONT_MONO, textColor=INK))]
            for k, v in spec_rows
        ],
        colWidths=[38 * mm, 132 * mm],
    )
    spec_tbl.setStyle(TableStyle([
        ("LINEBELOW", (0, 0), (-1, -1), 0.3, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ]))
    s.append(spec_tbl)
    s.append(Spacer(1, 8 * mm))

    # Contact block on copper
    s.append(Paragraph("REQUEST AN ENGINEERED PROPOSAL", st["overline"]))
    s.append(Spacer(1, 3 * mm))
    s.append(Paragraph(
        "Share your plant details and one of our engineers will get back with a "
        "tailored technical proposal &#8212; typically within 2 working days.",
        st["body_small"],
    ))
    s.append(Spacer(1, 3 * mm))
    contact = Table([
        [Paragraph("<font color='#B45309'><b>EMAIL</b></font>", st["stat_lab"]),
         Paragraph("contactus@vulcanindustriesindia.com", st["body_small"])],
        [Paragraph("<font color='#B45309'><b>WEB</b></font>", st["stat_lab"]),
         Paragraph("voccsys.com", st["body_small"])],
        [Paragraph("<font color='#B45309'><b>BY</b></font>", st["stat_lab"]),
         Paragraph("Vulcan Industries India · VOCCSYS™", st["body_small"])],
    ], colWidths=[22 * mm, 148 * mm])
    contact.setStyle(TableStyle([
        ("LINEBELOW", (0, 0), (-1, -1), 0.3, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ]))
    s.append(contact)
    return s


def generate_onepager(output_path: Path):
    output_path.parent.mkdir(parents=True, exist_ok=True)
    st = make_styles()

    doc = BaseDocTemplate(
        str(output_path),
        pagesize=A4,
        title="VOCCSYS — Product One-Pager",
        author="Vulcan Industries India",
        subject="Vulcan Online Condenser Cleaning System — 2 page summary",
        leftMargin=20 * mm, rightMargin=20 * mm,
        topMargin=22 * mm, bottomMargin=22 * mm,
    )
    frame_body = Frame(20 * mm, 22 * mm, A4[0] - 40 * mm, A4[1] - 44 * mm, id="body")
    doc.addPageTemplates([PageTemplate(id="body", frames=[frame_body], onPage=draw_page_frame)])

    story = []
    story.extend(build_onepager_page1(st))
    story.append(PageBreak())
    story.extend(build_onepager_page2(st))
    doc.build(story)


if __name__ == "__main__":
    public_dir = Path(__file__).resolve().parents[1] / "frontend" / "public"

    brochure = public_dir / "voccsys-brochure.pdf"
    generate(brochure)
    print(f"Brochure  → {brochure}  ({brochure.stat().st_size / 1024:.1f} KB)")

    onepager = public_dir / "voccsys-onepager.pdf"
    generate_onepager(onepager)
    print(f"One-pager → {onepager}  ({onepager.stat().st_size / 1024:.1f} KB)")

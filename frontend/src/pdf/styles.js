/**
 * styles.js
 *
 * Centralised design system for all react-pdf resume templates.
 * Every template imports from here — no ad-hoc inline styles.
 *
 * Built for @react-pdf/renderer v4.x
 * Font: Helvetica (built-in PDF font — 100% reliable, zero network dependency)
 */

import { StyleSheet } from "@react-pdf/renderer";

// ---------------------------------------------------------------------------
// Color palette
// ---------------------------------------------------------------------------

export const COLORS = {
    // Neutrals
    primary: "#111111",      // candidate name, section headings
    secondary: "#333333",    // job titles, subtitles, degrees
    muted: "#555555",        // dates, location, labels
    faint: "#888888",        // footer, page numbers
    text: "#222222",         // body text, bullet points

    // Borders & backgrounds
    border: "#DDDDDD",
    borderDark: "#CCCCCC",
    background: "#FFFFFF",
    chipBg: "#F8F8F8",

    // Accent
    accent: "#111111",

    // Links
    link: "#1155CC",
};

// ---------------------------------------------------------------------------
// Typography scale
// ---------------------------------------------------------------------------

export const FONT = {
    family: "Helvetica",
    familyBold: "Helvetica-Bold",
    familyItalic: "Helvetica-Oblique",
    familyBoldItalic: "Helvetica-BoldOblique",

    // Sizes
    name: 19,      // candidate full name
    h2: 9.5,       // section title (UPPERCASE, tracked)
    h3: 9.5,       // item title — job title, degree, project name
    body: 8.5,     // body text — descriptions, paragraphs, bullets
    small: 8,      // contact info, dates, badges
    tiny: 7.5,     // footer page number
};

// ---------------------------------------------------------------------------
// Spacing / layout constants
// ---------------------------------------------------------------------------

export const SPACING = {
    pageH: 36,    // page horizontal padding (~0.5 inch)
    pageV: 34,    // page vertical padding (top & bottom)
    section: 10,  // gap between sections
    item: 7,      // gap between items within a section
    bullet: 2,    // gap between bullet lines
};

// ---------------------------------------------------------------------------
// Centralised StyleSheet
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({

    /* =========================================================
       PAGE
    ========================================================= */

    page: {
        paddingTop: SPACING.pageV,
        paddingBottom: SPACING.pageV + 14,
        paddingHorizontal: SPACING.pageH,
        backgroundColor: COLORS.background,
        color: COLORS.primary,
        fontFamily: FONT.family,
        fontSize: FONT.body,
        lineHeight: 1.4,
    },

    /* =========================================================
       HEADER — candidate name + contact bar (NO FIXED)
    ========================================================= */

    header: {
        marginBottom: 10,
        paddingBottom: 8,
        borderBottomWidth: 1.5,
        borderBottomColor: COLORS.primary,
    },

    headerName: {
        fontSize: FONT.name,
        fontFamily: FONT.familyBold,
        color: COLORS.primary,
        letterSpacing: 0.2,
    },

    headerHeadline: {
        marginTop: 2,
        fontSize: 9.5,
        color: COLORS.secondary,
        fontFamily: FONT.family,
    },

    contactRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 5,
        alignItems: "center",
    },

    contactItem: {
        fontSize: FONT.small,
        color: COLORS.muted,
        marginRight: 10,
        marginTop: 2,
    },

    contactLink: {
        fontSize: FONT.small,
        color: COLORS.link,
        textDecoration: "none",
        marginRight: 10,
        marginTop: 2,
    },

    /* =========================================================
       SECTION
    ========================================================= */

    section: {
        marginTop: SPACING.section,
    },

    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },

    sectionTitle: {
        fontSize: FONT.h2,
        fontFamily: FONT.familyBold,
        color: COLORS.primary,
        textTransform: "uppercase",
        letterSpacing: 1.1,
        marginRight: 6,
    },

    sectionRule: {
        flex: 1,
        height: 0.75,
        backgroundColor: COLORS.borderDark,
    },

    /* =========================================================
       ITEM  (experience, education, project, certification)
    ========================================================= */

    item: {
        marginBottom: SPACING.item,
    },

    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },

    itemLeft: {
        flex: 1,
        marginRight: 8,
    },

    itemTitle: {
        fontSize: FONT.h3,
        fontFamily: FONT.familyBold,
        color: COLORS.primary,
    },

    itemSubtitle: {
        marginTop: 1,
        fontSize: 8.5,
        color: COLORS.secondary,
        fontFamily: FONT.family,
    },

    itemMeta: {
        fontSize: FONT.small,
        color: COLORS.muted,
        fontFamily: FONT.familyItalic,
        marginTop: 1,
    },

    itemDate: {
        fontSize: FONT.small,
        color: COLORS.muted,
        textAlign: "right",
        flexShrink: 0,
        marginTop: 1,
    },

    /* =========================================================
       BULLET POINTS
    ========================================================= */

    bulletList: {
        marginTop: 3,
        marginLeft: 2,
    },

    bulletItem: {
        flexDirection: "row",
        marginBottom: SPACING.bullet,
    },

    bulletDot: {
        width: 8,
        fontSize: FONT.body,
        color: COLORS.muted,
        flexShrink: 0,
    },

    bulletText: {
        flex: 1,
        fontSize: FONT.body,
        color: COLORS.text,
        lineHeight: 1.35,
    },

    /* =========================================================
       PARAGRAPH (summary)
    ========================================================= */

    paragraph: {
        fontSize: FONT.body,
        color: COLORS.text,
        lineHeight: 1.4,
    },

    /* =========================================================
       SKILLS
    ========================================================= */

    skillsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 4,
        marginTop: 2,
    },

    skillChip: {
        paddingVertical: 2,
        paddingHorizontal: 5,
        borderWidth: 0.5,
        borderColor: COLORS.borderDark,
        backgroundColor: COLORS.chipBg,
        borderRadius: 2,
    },

    skillChipText: {
        fontSize: 7.5,
        color: COLORS.secondary,
    },

    /* =========================================================
       TWO-COLUMN ROW (certifications, languages)
    ========================================================= */

    twoColGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },

    twoColLeft: {
        width: "50%",
        marginBottom: 4,
    },

    twoColName: {
        fontSize: FONT.body,
        fontFamily: FONT.familyBold,
        color: COLORS.primary,
    },

    twoColSub: {
        fontSize: FONT.small,
        color: COLORS.muted,
        marginTop: 1,
    },

    /* =========================================================
       LINKS (projects, certifications)
    ========================================================= */

    inlineLink: {
        fontSize: FONT.small,
        color: COLORS.link,
        textDecoration: "none",
    },

    linkRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 2,
        gap: 8,
    },

    /* =========================================================
       FOOTER — absolute-positioned page number (FIXED)
    ========================================================= */

    footer: {
        position: "absolute",
        bottom: 12,
        left: SPACING.pageH,
        right: SPACING.pageH,
        borderTopWidth: 0.5,
        borderTopColor: COLORS.border,
        paddingTop: 4,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    footerLeft: {
        fontSize: FONT.tiny,
        color: COLORS.faint,
    },

    footerRight: {
        fontSize: FONT.tiny,
        color: COLORS.faint,
    },
});

export default styles;
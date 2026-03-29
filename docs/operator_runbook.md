# NexFortis QuickBooks Service — Operator Runbook

**Operator:** Hassan Sadiq  
**Contact:** hassansadiq73@gmail.com  
**Last Updated:** March 2026

---

## Core Conversion Workflow

**Service:** Enterprise to Premier/Pro Conversion (#1) — $149 CAD  
**Target Turnaround:** Under 30 minutes (conversion only), Under 60 minutes (with add-ons)  
**Rush Delivery:** Under 15 minutes (conversion only)

### Step-by-Step Process

| Step | Action | Time Est. |
|------|--------|-----------|
| 1 | Order email arrives from Stripe — note customer name, email, file download link, services purchased, add-ons | — |
| 2 | Download .QBM file to `C:\Projects\qb-orders\<order-id>\input.qbm` | 1-2 min |
| 3 | Run dry-run validation: `qb-convert "input.qbm" --dry-run` | 2-3 min |
| 4 | If dry-run passes, check for purchased add-ons (see Add-On Processing below) | — |
| 5 | Run full conversion: `qb-convert "input.qbm" --output "converted.qbm" --report "report.html" --verbose` | 5-15 min |
| 6 | Open `report.html` in browser — verify conversion summary, data integrity counts, any warnings | 2-3 min |
| 7 | Email customer: attach `converted.qbm` + `report.html` (use Email Template #2) | 2-3 min |
| 8 | If Rush Delivery purchased: complete all steps within 15 minutes total | — |
| 9 | Archive order folder: move to `C:\Projects\qb-orders\completed\<order-id>\` | 1 min |
| 10 | Delete customer files after 7 days per privacy policy | — |

### Add-On Processing Order

When add-ons are purchased alongside the core conversion, process them in this order **before** running the full conversion:

| Order | Add-On | Command/Action | Time Est. |
|-------|--------|----------------|-----------|
| 1 | File Health Check (#2) | `qb-convert "input.qbm" --report` — generates pre-conversion health report | 3-5 min |
| 2 | Audit Trail Removal (#6) | Manual: Open in Enterprise → Edit → Preferences → Accounting → Condense → Remove Audit Trail | 5-10 min |
| 3 | List Reduction (#8) | Manual: Open in Enterprise → Review inactive items → Make Inactive/Merge | 10-15 min |
| 4 | Multi-Currency Removal (#9) | Manual: Requires new file creation without multi-currency enabled, data migration | 15-20 min |
| 5 | Super Condense (#7) | Manual: File → Utilities → Condense Data → select date range | 10-15 min |
| 6 | CRA Period Copy (#10) | Manual: File → Utilities → Condense Data → Transactions before specific date | 5-10 min |

**Note:** Add-ons #6-10 are Coming Soon (Tier 2). Only #2 and #3 are currently active.

---

## Troubleshooting Table

| Issue | Detection | Resolution | Email Template |
|-------|-----------|------------|----------------|
| File is already Premier/Pro format | Dry-run output shows "Edition: Premier" or "Edition: Pro" | Issue full refund. Inform customer their file is already in the target format. | #4 (Refund/Failed) |
| File is Pro edition (not Enterprise) | Dry-run output shows "Edition: Pro" | Issue full refund. Explain service is for Enterprise-to-Premier/Pro conversion only. | #4 (Refund/Failed) |
| File is US edition (not Canadian) | Dry-run output shows no GST/HST tax codes | Warn customer in email that the file appears to be a US edition. Proceed with conversion but note that Canadian tax settings may not apply. | #2 (modified) |
| Corrupted file | Dry-run fails with corruption error | Offer Data Recovery service ($199, Coming Soon) or issue full refund. | #4 (Refund/Failed) |
| Customer sent .QBB (backup) | File extension is .qbb | Reply with QBM creation guide. Do NOT refund — ask customer to re-upload correct file type. | #5 (QBM Creation Help) |
| Customer sent .QBW (working file) | File extension is .qbw | Reply with QBM creation guide. Do NOT refund — ask customer to re-upload correct file type. | #5 (QBM Creation Help) |
| Customer sent .QBO (Online) | File extension is .qbo | Reply explaining this is a QuickBooks Online file. Service is for Desktop Enterprise only. Offer refund. | #4 (Refund/Failed) |
| Conversion fails | `qb-convert` exits with non-zero code | Issue full refund immediately. Log the error for investigation. Escalate if recurring. | #4 (Refund/Failed) |
| File exceeds 500 MB | Upload system rejects or file is very large | Contact customer to arrange alternative delivery method (e.g., Google Drive, Dropbox link). | Custom email |
| File exceeds 100 MB (warning) | Upload system warns | Proceed normally but expect longer processing time. Inform customer if turnaround may be extended. | — |

---

## Daily Operations Checklist

1. Check Stripe dashboard for new orders (morning + afternoon)
2. Process orders in FIFO order (Rush orders first)
3. Verify all converted files before sending
4. Archive completed orders daily
5. Delete files older than 7 days
6. Check waitlist signups for new registrations
7. Respond to support tickets within 4 hours (1 hour for Premium Support subscribers)

---

## Pricing Quick Reference

| Service | Price CAD | Status |
|---------|-----------|--------|
| Enterprise to Premier/Pro (#1) | $149 | Active |
| File Health Check (#2) | +$49 | Active (add-on) |
| Rush Delivery (#3) | +$49 | Active (add-on) |
| Premium Support (#4) | $29/mo | Active |
| All Tier 2 services (#5-30) | Varies | Coming Soon — Waitlist only |
| All Tier 3 tools (#31-54) | Varies | Coming Soon — Waitlist only |

---

## File Management

- **Input folder:** `C:\Projects\qb-orders\<order-id>\`
- **Output naming:** `converted.qbm`, `report.html`
- **Completed folder:** `C:\Projects\qb-orders\completed\<order-id>\`
- **Retention:** Delete all customer files after 7 days
- **Maximum file size:** 500 MB (system limit)
- **Typical file size:** 5-30 MB

---

## Escalation

If an issue cannot be resolved using the troubleshooting table above:
1. Issue a full refund immediately
2. Log the issue with: order ID, customer email, file details, error output
3. Investigate root cause before accepting similar orders
4. Update this runbook with the resolution

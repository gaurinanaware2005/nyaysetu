import { CourtSyncRecord } from '../types';

export const SAMPLE_ECALLS_DATABASE: Record<string, CourtSyncRecord> = {
  'DLHC01-084920-2024': {
    cnrNumber: 'DLHC01-084920-2024',
    caseNumber: 'CC/412/2026',
    filingDate: '2026-04-15',
    registrationDate: '2026-04-19',
    courtName: 'National Consumer Disputes Redressal Commission (NCDRC)',
    courtComplex: "Upbhokta Nyay Bhawan, 'F' Block, GPO Complex, INA, New Delhi",
    bench: 'Hon\'ble Justice R.K. Bhasin (Presiding) & Smt. Vandana Sen (Member)',
    petitionerName: 'Meera Sharma',
    respondentName: 'RetailCo Electronics Pvt Ltd through MD',
    petitionerAdvocate: 'Adv. Anita Deshmukh (D/1429/2012)',
    respondentAdvocate: 'Adv. Rakesh Tandon (D/892/2008)',
    caseStage: 'Evidence by Complainant & Compliance of Cost Order',
    nextHearingDate: '2026-09-10',
    purposeOfHearing: 'Final Arguments on Interim Replacement & Costs Compliance',
    lastHearingDate: '2026-07-28',
    lastOrderSummary: 'Respondent granted final opportunity of two weeks to file technical inspection report subject to payment of ₹5,000 cost to Consumer Legal Aid Account. Re-listed for 10-09-2026.',
    causeListStatus: 'Item No. 24 (Morning Session)',
    sourceUrl: 'https://ecourts.gov.in/services/case_status_njdg?cnr=DLHC01-084920-2024',
    lastSyncedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST'
  },
  'DLHC01-033109-2025': {
    cnrNumber: 'DLHC01-033109-2025',
    caseNumber: 'CS(COMM) 184/2025',
    filingDate: '2025-11-25',
    registrationDate: '2025-12-02',
    courtName: 'High Court of Delhi at New Delhi',
    courtComplex: 'Sher Shah Road, New Delhi',
    bench: 'Hon\'ble Justice M.P. Saxena (Single Bench - Commercial Division)',
    petitionerName: 'Rajesh Gupta',
    respondentName: 'Urban Infra Projects Ltd',
    petitionerAdvocate: 'Adv. Anita Deshmukh',
    respondentAdvocate: 'Adv. K.S. Wadhwa',
    caseStage: 'Admission / Denial of Documents & Framing of Issues',
    nextHearingDate: '2026-09-18',
    purposeOfHearing: 'Scrutiny of Joint Inspection Report & Framing Issues',
    lastHearingDate: '2026-08-04',
    lastOrderSummary: 'Joint inspection report directed to be filed on or before 12.09.2026. Parties directed to complete admission/denial.',
    causeListStatus: 'Listed in Daily Cause List',
    sourceUrl: 'https://delhihighcourt.nic.in/case_status?cnr=DLHC01-033109-2025',
    lastSyncedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST'
  },
  'DLCT01-009124-2026': {
    cnrNumber: 'DLCT01-009124-2026',
    caseNumber: 'CC/912/2026 (NI Act)',
    filingDate: '2026-05-10',
    registrationDate: '2026-05-14',
    courtName: 'District & Sessions Court, Saket',
    courtComplex: 'Saket Court Complex, Sector 6, Pushp Vihar, New Delhi',
    bench: 'Court of Metropolitan Magistrate (Special NI Court)',
    petitionerName: 'Aarav Tech Solutions LLP',
    respondentName: 'Zenith Logistics & Supply Chain Ltd',
    petitionerAdvocate: 'Adv. Anita Deshmukh',
    respondentAdvocate: 'Adv. Amit Verma',
    caseStage: 'Complainant Evidence under Sec 145(2) NI Act',
    nextHearingDate: '2026-09-22',
    purposeOfHearing: 'Cross-examination of Authorized Representative',
    lastHearingDate: '2026-08-01',
    lastOrderSummary: 'Accused present on bail. Application under 145(2) allowed. Re-notified for 22.09.2026.',
    causeListStatus: 'Item No. 12 (Afternoon Session)',
    sourceUrl: 'https://services.ecourts.gov.in/ecourtindia_v6/?cnr=DLCT01-009124-2026',
    lastSyncedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST'
  }
};

export async function fetchECourtsData(cnrNumber: string): Promise<CourtSyncRecord> {
  // Simulate network round-trip to National Judicial Data Grid (NJDG)
  await new Promise(resolve => setTimeout(resolve, 800));

  const cleanCnr = cnrNumber.trim().toUpperCase();
  if (SAMPLE_ECALLS_DATABASE[cleanCnr]) {
    return {
      ...SAMPLE_ECALLS_DATABASE[cleanCnr],
      lastSyncedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST'
    };
  }

  // Realistic generator for any custom CNR
  const parts = cleanCnr.split('-');
  const stateCode = parts[0]?.slice(0, 2) || 'DL';
  const courtName = stateCode === 'MH' ? 'Bombay High Court' : 'High Court of Delhi';

  return {
    cnrNumber: cleanCnr || 'DLHC01-999999-2026',
    caseNumber: `WP(C)/${Math.floor(100 + Math.random() * 900)}/2026`,
    filingDate: '2026-02-10',
    registrationDate: '2026-02-15',
    courtName: courtName,
    courtComplex: 'Principal Seat Jurisdiction',
    bench: 'Hon\'ble Division Bench (Court 3)',
    petitionerName: 'Complainant / Petitioner',
    respondentName: 'Opposite Party / State',
    petitionerAdvocate: 'Adv. Anita Deshmukh',
    respondentAdvocate: 'Standing Counsel',
    caseStage: 'Hearing on Miscellaneous Petition',
    nextHearingDate: '2026-09-24',
    purposeOfHearing: 'Arguments on Preliminary Maintainability',
    lastHearingDate: '2026-08-11',
    lastOrderSummary: 'Notice issued to respondents. Counter-affidavit directed to be filed within 4 weeks. Listed on 24-09-2026.',
    causeListStatus: 'Listed in Daily Cause List',
    sourceUrl: `https://services.ecourts.gov.in/ecourtindia_v6/?cnr=${cleanCnr}`,
    lastSyncedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST'
  };
}

export const SAMPLE_CNRS = [
  { cnr: 'DLHC01-084920-2024', court: 'NCDRC Consumer' },
  { cnr: 'DLHC01-033109-2025', court: 'Delhi High Court Commercial' },
  { cnr: 'DLCT01-009124-2026', court: 'Saket District Court NI Act' }
];


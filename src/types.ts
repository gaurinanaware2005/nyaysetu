export type CaseStatus = 'Intake' | 'Active' | 'Awaiting Hearing' | 'Reserved' | 'Disposed';

export type CourtType = 
  | 'Supreme Court of India'
  | 'High Court of Delhi'
  | 'Bombay High Court'
  | 'District & Sessions Court, Saket'
  | 'National Consumer Disputes Redressal Commission (NCDRC)'
  | 'National Company Law Tribunal (NCLT)'
  | 'Debts Recovery Tribunal (DRT)';

export type CaseCategory = 
  | 'Consumer Protection'
  | 'Commercial Suit'
  | 'Writ Petition (Civil)'
  | 'Section 138 NI Act (Cheque Bounce)'
  | 'Arbitration & Conciliation'
  | 'Family & Succession'
  | 'Labor & Industrial';

export type PartyRole = 'Petitioner / Complainant' | 'Respondent / Opposite Party' | 'Opposing Counsel' | 'Witness' | 'Authorized Representative';

export interface Contact {
  id: string;
  name: string;
  nameHi?: string;
  type: 'Individual' | 'Company / Organization' | 'Government Authority';
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  panOrAadhar?: string;
  notes?: string;
}

export interface MatterParty {
  contactId: string;
  contact: Contact;
  role: PartyRole;
  isPrimaryClient?: boolean;
}

export interface DocumentItem {
  id: string;
  matterId: string;
  title: string;
  titleHi?: string;
  type: 'Petition' | 'Legal Notice' | 'Vakalatnama' | 'Court Order' | 'Evidence / Invoice' | 'Affidavit' | 'Written Statement' | 'Client Submission';
  fileSize: string;
  fileType: string;
  uploadedAt: string;
  uploadedBy: string;
  sha256Hash: string; // Bharatiya Sakshya Adhiniyam compliance
  ocrProcessed: boolean;
  ocrContent: string;
  ocrContentHi?: string;
  source: 'Upload' | 'eCourts Pull' | 'Document Assembly' | 'Client Portal' | 'Client Portal Upload';
  tags: string[];
}

export interface TaskItem {
  id: string;
  matterId: string;
  title: string;
  titleHi?: string;
  type: 'Hearing' | 'Filing Deadline' | 'Limitation Period' | 'Client Follow-up' | 'Evidence Collection';
  dueDate: string;
  time?: string;
  status: 'Pending' | 'Completed' | 'Overdue';
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string;
  reminderSent?: boolean;
  notes?: string;
}

export interface TimelineEvent {
  id: string;
  matterId: string;
  timestamp: string;
  title: string;
  titleHi?: string;
  description: string;
  descriptionHi?: string;
  actor: string;
  actorRole: 'Advocate' | 'Paralegal' | 'eCourts Bot' | 'Client' | 'System';
  type: 'CASE_CREATED' | 'ECOURTS_SYNC' | 'DOC_UPLOAD' | 'DOC_ASSEMBLED' | 'TASK_DUE' | 'WHATSAPP_SENT' | 'STATUS_CHANGE';
  referenceId?: string;
  badge?: string;
}

export interface CourtSyncRecord {
  cnrNumber: string;
  caseNumber: string;
  filingDate: string;
  registrationDate: string;
  courtName: string;
  courtComplex: string;
  bench: string;
  petitionerName: string;
  respondentName: string;
  petitionerAdvocate: string;
  respondentAdvocate: string;
  caseStage: string;
  nextHearingDate: string;
  purposeOfHearing: string;
  lastHearingDate: string;
  lastOrderSummary: string;
  causeListStatus: string;
  sourceUrl: string;
  lastSyncedAt: string;
}

export interface CommunicationLog {
  id: string;
  matterId: string;
  recipientName: string;
  recipientPhone: string;
  channel: 'WhatsApp' | 'SMS' | 'Email';
  timestamp: string;
  messageText: string;
  messageTextHi?: string;
  status: 'Delivered' | 'Read' | 'Sent';
  automatedReason: string;
}

export interface Matter {
  id: string;
  matterNumber: string; // e.g. NS-2024-042
  title: string;
  titleHi?: string;
  description: string;
  category: CaseCategory;
  court: CourtType;
  courtRoom?: string;
  cnrNumber?: string;
  caseNumber?: string; // e.g. CS(COMM) 214/2024
  status: CaseStatus;
  leadAdvocate: string;
  paralegalAssigned: string;
  openedDate: string;
  nextHearingDate?: string;
  limitationDeadline?: string;
  claimAmount?: string;
  parties: MatterParty[];
  courtRecord?: CourtSyncRecord;
  eCourtsTrackingActive: boolean;
  lastECourtsSync?: string;
}

export type UserRole = 'Advocate' | 'Paralegal' | 'Litigant' | 'ADVOCATE' | 'PARALEGAL' | 'CLIENT';
export type AppLanguage = 'en' | 'hi';

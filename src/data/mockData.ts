import { Contact, Matter, DocumentItem, TaskItem, TimelineEvent, CommunicationLog } from '../types';

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'cnt-1',
    name: 'Meera Sharma',
    nameHi: 'मीरा शर्मा',
    type: 'Individual',
    phone: '+91 98112 34567',
    email: 'meera.sharma@example.com',
    address: 'B-42, Gulmohar Park, South Extension',
    city: 'New Delhi',
    state: 'Delhi',
    panOrAadhar: 'XXXX-XXXX-4512',
    notes: 'Primary consumer complainant. Prefers WhatsApp updates in Hindi & English.'
  },
  {
    id: 'cnt-2',
    name: 'RetailCo Electronics Pvt Ltd',
    nameHi: 'रिटेलको इलेक्ट्रॉनिक्स प्राइवेट लिमिटेड',
    type: 'Company / Organization',
    phone: '+91 11 4567 8900',
    email: 'legal@retailcoindia.com',
    address: 'Plot 18, Okhla Industrial Area Phase-III',
    city: 'New Delhi',
    state: 'Delhi',
    notes: 'Opposite party in consumer dispute. Represented by Adv. Rakesh Tandon.'
  },
  {
    id: 'cnt-3',
    name: 'Adv. Rakesh Tandon',
    nameHi: 'एडवोकेट राकेश टंडन',
    type: 'Individual',
    phone: '+91 98200 87654',
    email: 'tandon.associates@barcouncil.org',
    address: 'Chamber 412, High Court Lawyers Block',
    city: 'New Delhi',
    state: 'Delhi',
    notes: 'Opposing Counsel for RetailCo.'
  },
  {
    id: 'cnt-4',
    name: 'Rajesh Gupta',
    nameHi: 'राजेश गुप्ता',
    type: 'Individual',
    phone: '+91 98765 43210',
    email: 'rajesh.gupta@infrabuild.in',
    address: '14A, Greater Kailash-I',
    city: 'New Delhi',
    state: 'Delhi',
  },
  {
    id: 'cnt-5',
    name: 'Urban Infra Projects Ltd',
    nameHi: 'अर्बन इन्फ्रा प्रोजेक्ट्स लिमिटेड',
    type: 'Company / Organization',
    phone: '+91 22 2845 1100',
    email: 'complaints@urbaninfra.co.in',
    address: 'Express Towers, Nariman Point',
    city: 'Mumbai',
    state: 'Maharashtra',
  },
  {
    id: 'cnt-6',
    name: 'Kavita Singh',
    nameHi: 'कविता सिंह',
    type: 'Individual',
    phone: '+91 99100 23411',
    email: 'kavita.singh@delhigov.in',
    address: 'Govt Quarters, D-II/4, Chanakyapuri',
    city: 'New Delhi',
    state: 'Delhi',
  }
];

export const INITIAL_MATTERS: Matter[] = [
  {
    id: 'matter-1',
    matterNumber: 'NS-2026-042',
    title: 'Meera Sharma v. RetailCo Electronics Pvt Ltd',
    titleHi: 'मीरा शर्मा बनाम रिटेलको इलेक्ट्रॉनिक्स प्राइवेट लिमिटेड',
    description: 'Consumer protection complaint under Section 35 of CPA 2019 regarding delivery of defective 85-inch OLED display unit and persistent refusal of warranty replacement.',
    category: 'Consumer Protection',
    court: 'National Consumer Disputes Redressal Commission (NCDRC)',
    courtRoom: 'Court Room 3, Presiding Member Hon\'ble Justice R.K. Bhasin',
    cnrNumber: 'DLHC01-084920-2024',
    caseNumber: 'CC/412/2026',
    status: 'Awaiting Hearing',
    leadAdvocate: 'Adv. Anita Deshmukh',
    paralegalAssigned: 'Rahul Verma',
    openedDate: '2026-04-12',
    nextHearingDate: '2026-09-10',
    limitationDeadline: '2026-10-15',
    claimAmount: '₹ 1,85,000 + ₹ 50,000 compensation',
    parties: [
      {
        contactId: 'cnt-1',
        contact: INITIAL_CONTACTS[0],
        role: 'Petitioner / Complainant',
        isPrimaryClient: true
      },
      {
        contactId: 'cnt-2',
        contact: INITIAL_CONTACTS[1],
        role: 'Respondent / Opposite Party'
      },
      {
        contactId: 'cnt-3',
        contact: INITIAL_CONTACTS[2],
        role: 'Opposing Counsel'
      }
    ],
    eCourtsTrackingActive: true,
    courtRecord: {
      cnrNumber: 'DLHC01-084920-2024',
      caseNumber: 'CC/412/2026',
      filingDate: '2026-04-15',
      registrationDate: '2026-04-19',
      courtName: 'NCDRC Principal Bench, New Delhi',
      courtComplex: 'Upbhokta Nyay Bhawan, INA, New Delhi',
      bench: 'Hon\'ble Justice R.K. Bhasin & Smt. Vandana Sen (Member)',
      petitionerName: 'Meera Sharma',
      respondentName: 'RetailCo Electronics Pvt Ltd through its Managing Director',
      petitionerAdvocate: 'Adv. Anita Deshmukh (D/1429/2012)',
      respondentAdvocate: 'Adv. Rakesh Tandon',
      caseStage: 'Evidence on Affidavit & Arguments on Interim Relief',
      nextHearingDate: '2026-09-10',
      purposeOfHearing: 'Filing of Evidence by Complainant & Compliance Check',
      lastHearingDate: '2026-07-28',
      lastOrderSummary: 'Respondent granted final opportunity to file reply subject to ₹ 5,000 cost. Re-listed for 10-09-2026.',
      causeListStatus: 'Item No. 24 (Morning Session)',
      sourceUrl: 'https://ecourts.gov.in/services/case_status_njdg?cnr=DLHC01-084920-2024',
      lastSyncedAt: '2026-09-04 18:30 IST'
    }
  },
  {
    id: 'matter-2',
    matterNumber: 'NS-2026-018',
    title: 'Rajesh Gupta v. Urban Infra Projects Ltd',
    titleHi: 'राजेश गुप्ता बनाम अर्बन इन्फ्रा प्रोजेक्ट्स लिमिटेड',
    description: 'Commercial arbitration and recovery dispute regarding non-handover of commercial bay within stipulated RERA timeframe.',
    category: 'Commercial Suit',
    court: 'High Court of Delhi',
    courtRoom: 'Court No. 14, Hon\'ble Justice M.P. Saxena',
    cnrNumber: 'DLHC01-033109-2025',
    caseNumber: 'CS(COMM) 184/2025',
    status: 'Active',
    leadAdvocate: 'Adv. Anita Deshmukh',
    paralegalAssigned: 'Rahul Verma',
    openedDate: '2025-11-20',
    nextHearingDate: '2026-09-18',
    limitationDeadline: '2026-11-01',
    claimAmount: '₹ 42,00,000',
    parties: [
      {
        contactId: 'cnt-4',
        contact: INITIAL_CONTACTS[3],
        role: 'Petitioner / Complainant',
        isPrimaryClient: true
      },
      {
        contactId: 'cnt-5',
        contact: INITIAL_CONTACTS[4],
        role: 'Respondent / Opposite Party'
      }
    ],
    eCourtsTrackingActive: true,
    courtRecord: {
      cnrNumber: 'DLHC01-033109-2025',
      caseNumber: 'CS(COMM) 184/2025',
      filingDate: '2025-11-25',
      registrationDate: '2025-12-02',
      courtName: 'High Court of Delhi at New Delhi',
      courtComplex: 'Sher Shah Road, New Delhi',
      bench: 'Hon\'ble Justice M.P. Saxena',
      petitionerName: 'Rajesh Gupta',
      respondentName: 'Urban Infra Projects Ltd',
      petitionerAdvocate: 'Adv. Anita Deshmukh',
      respondentAdvocate: 'Adv. K.S. Wadhwa',
      caseStage: 'Framing of Preliminary Issues',
      nextHearingDate: '2026-09-18',
      purposeOfHearing: 'Admission/Denial of Documents',
      lastHearingDate: '2026-08-04',
      lastOrderSummary: 'Joint inspection report directed. Re-listed for 18-09-2026.',
      causeListStatus: 'Listed in Daily Cause List',
      sourceUrl: 'https://delhihighcourt.nic.in/case_status?cnr=DLHC01-033109-2025',
      lastSyncedAt: '2026-09-03 14:15 IST'
    }
  },
  {
    id: 'matter-3',
    matterNumber: 'NS-2026-031',
    title: 'Kavita Singh v. Department of Education & Ors',
    titleHi: 'कविता सिंह बनाम शिक्षा विभाग एवं अन्य',
    description: 'Writ Petition under Article 226 for regularization of senior lecturer grade pay and retrospective seniority benefits.',
    category: 'Writ Petition (Civil)',
    court: 'High Court of Delhi',
    courtRoom: 'Court No. 7, Division Bench II',
    cnrNumber: 'DLHC01-055412-2026',
    caseNumber: 'W.P.(C) 3812/2026',
    status: 'Intake',
    leadAdvocate: 'Adv. Anita Deshmukh',
    paralegalAssigned: 'Rahul Verma',
    openedDate: '2026-08-20',
    nextHearingDate: '2026-09-25',
    claimAmount: 'Statutory Relief',
    parties: [
      {
        contactId: 'cnt-6',
        contact: INITIAL_CONTACTS[5],
        role: 'Petitioner / Complainant',
        isPrimaryClient: true
      }
    ],
    eCourtsTrackingActive: false
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    matterId: 'matter-1',
    title: 'Legal Notice - Defective Goods & Consumer Redressal.pdf',
    titleHi: 'कानूनी नोटिस - दोषपूर्ण माल और उपभोक्ता निवारण.pdf',
    type: 'Legal Notice',
    fileSize: '418 KB',
    fileType: 'application/pdf',
    uploadedAt: '2026-04-14 11:20 IST',
    uploadedBy: 'Adv. Anita Deshmukh',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    ocrProcessed: true,
    ocrContent: `LEGAL NOTICE UNDER SECTION 35 OF CONSUMER PROTECTION ACT, 2019
To:
The Managing Director, RetailCo Electronics Pvt Ltd, Plot 18, Okhla Industrial Area Phase-III, New Delhi 110020.
Subject: Formal demand for immediate replacement or full refund of ₹1,45,000/- towards defective 85-inch Smart OLED Display (Model: RC-85OLED-X) along with interest and compensation.
Sir/Madam,
Under instructions and on behalf of my client Ms. Meera Sharma, residing at B-42, Gulmohar Park, New Delhi, I hereby serve you with this formal Legal Notice:
1. That my client purchased one 85-inch Smart OLED Television bearing serial number RC-TV-2023-8891 on 10th December 2023 vide Tax Invoice No. RET/DEL/2023/9412 for a total consideration of ₹1,45,000/- (Rupees One Lakh Forty Five Thousand only).
2. That within three weeks of installation, the television panel developed severe vertical black bands and screen flickering, rendering the appliance completely unusable.
3. That repeated complaints lodged with your authorized service center (Ticket #SRV-90124) resulted in service engineers confirming panel failure. However, your customer escalation desk arbitrarily refused warranty coverage claiming internal screen defect, which is false, malicious, and a patent deficiency of service under Section 2(11) of CPA 2019.
4. Take notice that you are hereby called upon to either replace the defective unit with a brand new sealed appliance or refund the entire invoice sum of ₹1,45,000/- along with ₹50,000/- towards mental harassment within 15 days of receipt of this notice, failing which my client shall initiate proceedings before the Hon'ble Consumer Commission at your risk as to costs and consequences.
Yours faithfully,
Adv. Anita Deshmukh (Enrolment No. D/1429/2012)
Counsel for Complainant`,
    source: 'Upload',
    tags: ['Notice', 'Warranty', 'Defective Display', 'CPA 2019']
  },
  {
    id: 'doc-2',
    matterId: 'matter-1',
    title: 'Tax Invoice & Extended Warranty Card #RET-9412.pdf',
    titleHi: 'टैक्स इनवॉइस और वारंटी कार्ड #RET-9412.pdf',
    type: 'Evidence / Invoice',
    fileSize: '890 KB',
    fileType: 'application/pdf',
    uploadedAt: '2026-04-14 11:25 IST',
    uploadedBy: 'Rahul Verma',
    sha256Hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    ocrProcessed: true,
    ocrContent: `TAX INVOICE - RETAILCO ELECTRONICS STORE (SOUTH EXTENSION BRANCH)
GSTIN: 07AAACR4912K1Z9
Invoice No: RET/DEL/2023/9412 | Date: 10-12-2023
Customer Name: Ms. Meera Sharma | Phone: +91 98112 34567
Item: Ultra HD 4K OLED TV 85" | HSN: 852872
Warranty Period: 2 Years Comprehensive on Panel & Motherboard + 1 Year Extended Service Care
Total Amount Paid: ₹ 1,45,000.00 (Mode: HDFC Bank Credit Card)
Terms & Conditions: Manufacturer warranty covers all electronic panel faults, vertical screen banding, and display motherboard failures not resulting from external physical liquid damage. Authorized signature verified.`,
    source: 'Upload',
    tags: ['Invoice', 'Proof of Purchase', 'Warranty']
  },
  {
    id: 'doc-3',
    matterId: 'matter-1',
    title: 'eCourts Certified Daily Order Sheet (28-07-2026).pdf',
    titleHi: 'ई-कोर्ट्स प्रमाणित दैनिक आदेश पत्र (28-07-2026).pdf',
    type: 'Court Order',
    fileSize: '310 KB',
    fileType: 'application/pdf',
    uploadedAt: '2026-07-29 09:40 IST',
    uploadedBy: 'eCourts Sync Engine',
    sha256Hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    ocrProcessed: true,
    ocrContent: `BEFORE THE NATIONAL CONSUMER DISPUTES REDRESSAL COMMISSION
CONSUMER COMPLAINT NO. 412 OF 2026
IN THE MATTER OF: Meera Sharma ...Complainant vs RetailCo Electronics Pvt Ltd ...Opposite Party
CORAM: Hon'ble Justice R.K. Bhasin, Presiding Member; Smt. Vandana Sen, Member
PRESENT: Adv. Anita Deshmukh for Complainant; Adv. Rakesh Tandon for Opposite Party
ORDER DATED 28.07.2026:
Opposite Party seeks one final extension of two weeks to place on record the technical inspection report regarding television panel defect. Learned counsel for Complainant vehemently opposes in view of prolonged delay. Considering submissions, final opportunity is granted to Opposite Party subject to payment of ₹ 5,000/- as costs to the Consumer Legal Aid Account. List the matter for final hearing and arguments on interim relief on 10.09.2026.`,
    source: 'eCourts Pull',
    tags: ['Court Order', 'Costs Awarded', 'Next Date: 10-09-2026']
  }
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    matterId: 'matter-1',
    title: 'Attend NCDRC Hearing (Court Room 3, Item 24)',
    titleHi: 'एनसीडीआरसी सुनवाई में उपस्थित हों (कोर्ट रूम 3, आइटम 24)',
    type: 'Hearing',
    dueDate: '2026-09-10',
    time: '10:30 AM',
    status: 'Pending',
    priority: 'High',
    assignedTo: 'Adv. Anita Deshmukh',
    reminderSent: true,
    notes: 'Opposite party must produce inspection report or cost receipt. Arguments on interim replacement.'
  },
  {
    id: 'task-2',
    matterId: 'matter-1',
    title: 'File Rejoinder & Affidavit of Evidence',
    titleHi: 'प्रतिउत्तर और साक्ष्य का शपथपत्र दाखिल करें',
    type: 'Filing Deadline',
    dueDate: '2026-09-08',
    time: '04:00 PM',
    status: 'Pending',
    priority: 'High',
    assignedTo: 'Rahul Verma',
    reminderSent: false,
    notes: 'Attach technician visit card and WhatsApp screenshot of service rejection.'
  },
  {
    id: 'task-3',
    matterId: 'matter-1',
    title: 'Send automated WhatsApp hearing alert to client Meera',
    titleHi: 'मुवक्किल मीरा को व्हाट्सएप सुनवाई अलर्ट भेजें',
    type: 'Client Follow-up',
    dueDate: '2026-09-07',
    time: '11:00 AM',
    status: 'Completed',
    priority: 'Medium',
    assignedTo: 'NyaySetu Bot',
    reminderSent: true,
    notes: 'Client informed regarding 10 Sept hearing and asked to keep original invoice ready.'
  },
  {
    id: 'task-4',
    matterId: 'matter-2',
    title: 'Inspect disputed commercial bay at Greater Noida',
    titleHi: 'ग्रेटर नोएडा में विवादित वाणिज्यिक बे का निरीक्षण करें',
    type: 'Evidence Collection',
    dueDate: '2026-09-14',
    status: 'Pending',
    priority: 'Medium',
    assignedTo: 'Rahul Verma'
  }
];

export const INITIAL_TIMELINE: TimelineEvent[] = [
  {
    id: 'tl-1',
    matterId: 'matter-1',
    timestamp: '2026-04-12 10:15 IST',
    title: 'Matter Initialized via Guided Intake',
    titleHi: 'निर्देशित प्रवेश द्वारा मामला प्रारंभ किया गया',
    description: 'Case created by Adv. Anita Deshmukh. Client Meera Sharma linked with contact details and claim summary ₹1,85,000.',
    actor: 'Adv. Anita Deshmukh',
    actorRole: 'Advocate',
    type: 'CASE_CREATED',
    badge: 'Intake'
  },
  {
    id: 'tl-2',
    matterId: 'matter-1',
    timestamp: '2026-04-14 11:22 IST',
    title: 'Document Uploaded & Auto-OCR Completed',
    titleHi: 'दस्तावेज़ अपलोड और स्वतः ओसीआर पूर्ण',
    description: 'Uploaded Legal Notice & Tax Invoice. SHA-256 hash generated for digital evidence compliance (Bharatiya Sakshya Adhiniyam). Text indexed for full-text search.',
    actor: 'Rahul Verma',
    actorRole: 'Paralegal',
    type: 'DOC_UPLOAD',
    badge: 'OCR Verified'
  },
  {
    id: 'tl-3',
    matterId: 'matter-1',
    timestamp: '2026-04-19 16:45 IST',
    title: 'eCourts Tracking Activated & Case Registered',
    titleHi: 'ई-कोर्ट ट्रैकिंग सक्रिय और मामला पंजीकृत',
    description: 'Linked CNR Number DLHC01-084920-2024. Automatic sync established with National Judicial Data Grid (NJDG).',
    actor: 'NyaySetu eCourts Bot',
    actorRole: 'eCourts Bot',
    type: 'ECOURTS_SYNC',
    badge: 'NJDG Sync'
  },
  {
    id: 'tl-4',
    matterId: 'matter-1',
    timestamp: '2026-07-28 17:30 IST',
    title: 'eCourts Hearing Update Pulled & Confirmed',
    titleHi: 'ई-कोर्ट सुनवाई अपडेट प्राप्त और पुष्टि',
    description: 'Pulled next hearing date (10 Sept 2026) and Daily Order. Pushed directly to firm calendar & assigned task to Adv. Anita.',
    actor: 'Adv. Anita Deshmukh',
    actorRole: 'Advocate',
    type: 'ECOURTS_SYNC',
    badge: 'Date Updated'
  },
  {
    id: 'tl-5',
    matterId: 'matter-1',
    timestamp: '2026-09-04 11:00 IST',
    title: 'Client WhatsApp Status Notification Dispatched',
    titleHi: 'मुवक्किल व्हाट्सएप स्थिति अधिसूचना प्रेषित',
    description: 'Sent bilingual hearing update and document checklist to Meera Sharma (+91 98112 34567). Status: Delivered & Read.',
    actor: 'NyaySetu Gateway',
    actorRole: 'System',
    type: 'WHATSAPP_SENT',
    badge: 'Delivered'
  }
];

export const INITIAL_COMMS: CommunicationLog[] = [
  {
    id: 'comm-1',
    matterId: 'matter-1',
    recipientName: 'Meera Sharma',
    recipientPhone: '+91 98112 34567',
    channel: 'WhatsApp',
    timestamp: '2026-09-04 11:00 IST',
    messageText: `Namaste Meera ji. Update regarding your Consumer Case (CC/412/2026) vs RetailCo: Your hearing is listed before the Hon'ble NCDRC on Thursday, 10 September 2026 (Item #24). Our office is filing the rejoinder. Please keep your original warranty card and invoice handy. - Adv. Anita Deshmukh's Office (NyaySetu Portal)`,
    messageTextHi: `नमस्ते मीरा जी। रिटेलको के विरुद्ध आपके उपभोक्ता मामले (CC/412/2026) के संबंध में अपडेट: आपकी सुनवाई गुरुवार, 10 सितंबर 2026 (आइटम #24) को माननीय एनसीडीआरसी के समक्ष सूचीबद्ध है। हमारा कार्यालय प्रतिउत्तर दाखिल कर रहा है। कृपया अपना मूल वारंटी कार्ड और इनवॉइस तैयार रखें। - एडवोकेट अनीता देशमुख का कार्यालय (न्याय सेतु पोर्टल)`,
    status: 'Read',
    automatedReason: 'Automated 6-Day Hearing Countdown Trigger'
  },
  {
    id: 'comm-2',
    matterId: 'matter-1',
    recipientName: 'Meera Sharma',
    recipientPhone: '+91 98112 34567',
    channel: 'SMS',
    timestamp: '2026-07-28 17:45 IST',
    messageText: 'NyaySetu Alert: Court Order in CC/412/2026: Cost of Rs 5000 imposed on RetailCo. Next date: 10-09-2026. View details in your client portal.',
    status: 'Delivered',
    automatedReason: 'eCourts Order Sheet Download Trigger'
  }
];

import { Matter, AppLanguage } from '../types';

export interface AssemblyTemplate {
  id: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  category: string;
  fields: {
    key: string;
    label: string;
    labelHi: string;
    type: 'text' | 'textarea' | 'date' | 'select' | 'currency';
    options?: string[];
    defaultValueFromMatter?: (matter: Matter) => string;
  }[];
}

export const ASSEMBLY_TEMPLATES: AssemblyTemplate[] = [
  {
    id: 'tpl-vakalatnama',
    name: 'Vakalatnama (Advocate Authorization)',
    nameHi: 'वकालतनामा (अधिवक्ता प्राधिकरण पत्र)',
    description: 'Standard authorization document executed by client appointing advocate to plead and act before court.',
    descriptionHi: 'न्यायालय के समक्ष उपस्थित होने और बहस करने के लिए मुवक्किल द्वारा निष्पादित मानक प्राधिकरण प्रपत्र।',
    category: 'Court Filings',
    fields: [
      {
        key: 'courtName',
        label: 'Court / Tribunal',
        labelHi: 'न्यायालय / न्यायाधिकरण',
        type: 'text',
        defaultValueFromMatter: (m) => m.court
      },
      {
        key: 'caseNumber',
        label: 'Case / Complaint No.',
        labelHi: 'केस / शिकायत संख्या',
        type: 'text',
        defaultValueFromMatter: (m) => m.caseNumber || 'CC/412/2026'
      },
      {
        key: 'clientName',
        label: 'Client / Appointor Name',
        labelHi: 'मुवक्किल का नाम',
        type: 'text',
        defaultValueFromMatter: (m) => m.parties.find(p => p.isPrimaryClient)?.contact.name || 'Meera Sharma'
      },
      {
        key: 'oppositeParty',
        label: 'Opposite Party / Respondent',
        labelHi: 'विपक्षी पार्टी / प्रतिवादी',
        type: 'text',
        defaultValueFromMatter: (m) => m.parties.find(p => p.role.includes('Respondent'))?.contact.name || 'RetailCo Electronics Pvt Ltd'
      },
      {
        key: 'advocateName',
        label: 'Advocate Appointed',
        labelHi: 'नियुक्त अधिवक्ता का नाम',
        type: 'text',
        defaultValueFromMatter: (m) => m.leadAdvocate || 'Adv. Anita Deshmukh'
      },
      {
        key: 'barEnrolment',
        label: 'Bar Council Enrolment No.',
        labelHi: 'बार काउंसिल नामांकन संख्या',
        type: 'text',
        defaultValueFromMatter: () => 'D/1429/2012 (Bar Council of Delhi)'
      },
      {
        key: 'advocateAddress',
        label: 'Chamber / Office Address',
        labelHi: 'चैंबर / कार्यालय का पता',
        type: 'text',
        defaultValueFromMatter: () => 'Chamber No. 318, Lawyers Chambers Block, Delhi High Court, New Delhi - 110003'
      }
    ]
  },
  {
    id: 'tpl-legal-notice',
    name: 'Statutory Legal Notice (Consumer CPA 2019)',
    nameHi: 'वैधानिक कानूनी नोटिस (उपभोक्ता संरक्षण अधिनियम)',
    description: 'Formal pre-litigation demand notice under CPA 2019 for defective goods & deficiency of service.',
    descriptionHi: 'दोषपूर्ण सामान और सेवा में कमी के लिए सीपीए 2019 के तहत औपचारिक कानूनी मांग नोटिस।',
    category: 'Notices',
    fields: [
      {
        key: 'clientName',
        label: 'Complainant / Client Name',
        labelHi: 'शिकायतकर्ता / मुवक्किल का नाम',
        type: 'text',
        defaultValueFromMatter: (m) => m.parties.find(p => p.isPrimaryClient)?.contact.name || 'Meera Sharma'
      },
      {
        key: 'oppositeParty',
        label: 'Opposite Party / Retailer',
        labelHi: 'विपक्षी पार्टी / विक्रेता',
        type: 'text',
        defaultValueFromMatter: (m) => m.parties.find(p => p.role.includes('Respondent'))?.contact.name || 'RetailCo Electronics Pvt Ltd'
      },
      {
        key: 'productDetails',
        label: 'Product Description & Invoice No.',
        labelHi: 'उत्पाद विवरण एवं इनवॉइस संख्या',
        type: 'text',
        defaultValueFromMatter: () => '85-inch Smart OLED TV (Model RC-85OLED-X) vide Invoice #RET/DEL/2023/9412'
      },
      {
        key: 'defectNature',
        label: 'Nature of Defect / Grievance',
        labelHi: 'दोष / शिकायत की प्रकृति',
        type: 'textarea',
        defaultValueFromMatter: () => 'Severe vertical screen banding, black-out display failure within 3 weeks of purchase, followed by arbitrary denial of warranty replacement.'
      },
      {
        key: 'claimAmount',
        label: 'Claim Amount & Damages (₹)',
        labelHi: 'दावा राशि एवं क्षतिपूर्ति (₹)',
        type: 'currency',
        defaultValueFromMatter: (m) => m.claimAmount || '₹ 1,85,000 + ₹ 50,000'
      },
      {
        key: 'curePeriod',
        label: 'Notice Cure Period (Days)',
        labelHi: 'नोटिस निवारण अवधि (दिन)',
        type: 'select',
        options: ['15 Days', '21 Days', '30 Days'],
        defaultValueFromMatter: () => '15 Days'
      }
    ]
  },
  {
    id: 'tpl-affidavit',
    name: 'Affidavit of Evidence (Evidence Act / BSA 2023)',
    nameHi: 'साक्ष्य का शपथपत्र (भारतीय साक्ष्य अधिनियम 2023)',
    description: 'Sworn affidavit supporting petition compliant with Section 63/65B certificate for digital records.',
    descriptionHi: 'डिजिटल रिकॉर्ड के प्रमाणीकरण के साथ याचिका के समर्थन में शपथपत्र।',
    category: 'Pleadings',
    fields: [
      {
        key: 'courtName',
        label: 'Court / Forum',
        labelHi: 'न्यायालय / मंच',
        type: 'text',
        defaultValueFromMatter: (m) => m.court
      },
      {
        key: 'deponentName',
        label: 'Deponent (Client) Name',
        labelHi: 'शपथकर्ता का नाम',
        type: 'text',
        defaultValueFromMatter: (m) => m.parties.find(p => p.isPrimaryClient)?.contact.name || 'Meera Sharma'
      },
      {
        key: 'caseNumber',
        label: 'Case Number',
        labelHi: 'केस संख्या',
        type: 'text',
        defaultValueFromMatter: (m) => m.caseNumber || 'CC/412/2026'
      },
      {
        key: 'deponentAge',
        label: 'Age of Deponent',
        labelHi: 'शपथकर्ता की आयु',
        type: 'text',
        defaultValueFromMatter: () => '36 Years'
      },
      {
        key: 'deponentAddress',
        label: 'Residential Address',
        labelHi: 'निवास का पता',
        type: 'text',
        defaultValueFromMatter: (m) => m.parties.find(p => p.isPrimaryClient)?.contact.address || 'B-42, Gulmohar Park, New Delhi'
      }
    ]
  }
];

export function generateLegalDocumentContent(
  templateId: string,
  formData: Record<string, string>,
  lang: AppLanguage = 'en'
): string {
  const isHi = lang === 'hi';
  const currentDate = new Date().toLocaleDateString(isHi ? 'hi-IN' : 'en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  if (templateId === 'tpl-vakalatnama') {
    if (isHi) {
      return `वकालतनामा (प्राधिकरण प्रपत्र)
न्यायालय: ${formData.courtName || 'माननीय उपभोक्ता आयोग / उच्च न्यायालय'}
वाद / शिकायत संख्या: ${formData.caseNumber || 'CC/412/2026'}

पक्षकार:
${formData.clientName || 'मीरा शर्मा'}  ...शिकायतकर्ता / मुवक्किल
बनाम
${formData.oppositeParty || 'रिटेलको इलेक्ट्रॉनिक्स प्रा. लि.'}  ...विपक्षी पक्षकार

जानें कि मैं/हम, उपरोक्त नामित ${formData.clientName || 'मीरा शर्मा'}, एतद्द्वारा नियुक्त एवं प्राधिकृत करता/करती हूँ:
${formData.advocateName || 'एडवोकेट अनीता देशमुख'} (नामांकन संख्या: ${formData.barEnrolment || 'D/1429/2012'})
कार्यालय: ${formData.advocateAddress || 'दिल्ली उच्च न्यायालय, नई दिल्ली'}

को मेरे/हमारे उक्त वाद में मेरी/हमारी ओर से उपस्थित होने, अभिवचन करने, कार्य करने, साक्ष्य प्रस्तुत करने, समझौता करने और सभी आवश्यक विधिक आवेदन प्रस्तुत करने के लिए पूर्ण शक्ति प्रदान की जाती है।

मुवक्किल के हस्ताक्षर: __________________________
(${formData.clientName || 'मीरा शर्मा'})

स्वीकृत एवं अभिस्वीकृत:
अधिवक्ता के हस्ताक्षर: __________________________
(${formData.advocateName || 'एडवोकेट अनीता देशमुख'})
स्थान: नई दिल्ली | दिनांक: ${currentDate}`;
    }

    return `VAKALATNAMA
BEFORE THE ${formData.courtName?.toUpperCase() || 'HON\'BLE COMMISSION / HIGH COURT'}
CASE / COMPLAINT NO: ${formData.caseNumber || 'CC/412/2026'}

IN THE MATTER OF:
${formData.clientName || 'Meera Sharma'} ...Complainant / Petitioner
VERSUS
${formData.oppositeParty || 'RetailCo Electronics Pvt Ltd'} ...Opposite Party / Respondent

KNOW ALL to whom these presents shall come that I/We, the undersigned ${formData.clientName || 'Meera Sharma'}, do hereby appoint, nominate and authorize:
${formData.advocateName || 'Adv. Anita Deshmukh'}, Advocate
Enrolment No: ${formData.barEnrolment || 'D/1429/2012 (Bar Council of Delhi)'}
Office: ${formData.advocateAddress || 'Chamber 318, Lawyers Chambers Block, New Delhi'}

To be my/our true and lawful Advocate(s) to appear, act, plead, sign petitions, file evidence, produce documents, and represent me/us in the above-titled proceedings before this Hon'ble Court. I/We undertake to ratify and confirm all acts done by the said Advocate as if done by myself/ourselves.

IN WITNESS WHEREOF I/We have signed this Vakalatnama on this ${currentDate}.

CLIENT / APPOINTOR:
Signature: ______________________________
(${formData.clientName || 'Meera Sharma'})

ACCEPTED & FILED:
ADVOCATE FOR COMPLAINANT:
Signature: ______________________________
(${formData.advocateName || 'Adv. Anita Deshmukh'})
Place: New Delhi`;
  }

  if (templateId === 'tpl-legal-notice') {
    if (isHi) {
      return `स्पीड पोस्ट / ईमेल द्वारा वैधानिक कानूनी नोटिस
दिनांक: ${currentDate}

सेवा में,
प्रबंध निदेशक,
${formData.oppositeParty || 'रिटेलको इलेक्ट्रॉनिक्स प्राइवेट लिमिटेड'},
प्लॉट 18, ओखला औद्योगिक क्षेत्र, नई दिल्ली - 110020.

विषय: उपभोक्ता संरक्षण अधिनियम 2019 की धारा 35 के अंतर्गत कानूनी नोटिस - दोषपूर्ण उत्पाद एवं सेवा में कमी हेतु दावा राशि ${formData.claimAmount || '₹1,85,000/-'}।

महोदय,
मेरी मुवक्किल ${formData.clientName || 'मीरा शर्मा'} के विधिक निर्देशों के अधीन, मैं आपको निम्नलिखित नोटिस प्रेषित करता/करती हूँ:
1. मेरी मुवक्किल ने आपकी दुकान से ${formData.productDetails || '85-इंच स्मार्ट OLED टीवी'} क्रय किया था।
2. क्रय के तत्काल पश्चात उत्पाद में निम्नलिखित गंभीर तकनीकी दोष उत्पन्न हुए:
   "${formData.defectNature || 'स्क्रीन का स्वतः बंद होना तथा पैनल में लंबवत काली रेखाएं दिखाई देना।'}"
3. वारंटी अवधि के दौरान वैध शिकायत के बावजूद आपने उत्पाद बदलने से अनुचित एवं अवैध रूप से इनकार किया, जो धारा 2(11) के अंतर्गत गंभीर सेवा-दोष है।
4. अतः आपको सूचित किया जाता है कि इस नोटिस की प्राप्ति के ${formData.curePeriod || '15 दिनों'} के भीतर या तो उत्पाद को नए उपकरण से बदलें अथवा संपूर्ण राशि ₹1,45,000/- मय मानसिक प्रताड़ना क्षतिपूर्ति ₹50,000/- कुल ${formData.claimAmount || '₹1,95,000/-'} का भुगतान करें।
विफल रहने की स्थिति में उपभोक्ता आयोग के समक्ष वाद दायर किया जाएगा जिसका संपूर्ण व्यय आपका होगा।

भवदीया,
एडवोकेट अनीता देशमुख
मुवक्किल हेतु अधिवक्ता`;
    }

    return `FORMAL LEGAL NOTICE (REGISTERED A.D. & SPEED POST)
Date: ${currentDate}

TO:
The Managing Director / Authorized Signatory,
${formData.oppositeParty || 'RetailCo Electronics Pvt Ltd'},
Plot 18, Okhla Industrial Area Phase-III, New Delhi - 110020.

SUBJECT: STATUTORY LEGAL NOTICE UNDER SECTION 35 OF CONSUMER PROTECTION ACT, 2019 FOR IMMEDIATE REPLACEMENT / REFUND OF DEFECTIVE PRODUCT WITH DAMAGES OF ${formData.claimAmount || '₹ 1,85,000/-'}.

SIR/MADAM,
Under instructions and on behalf of my client ${formData.clientName || 'Ms. Meera Sharma'}, residing at New Delhi, I hereby serve you with this formal Legal Notice as under:

1. That my client purchased from your retail store the following equipment:
   "${formData.productDetails || '85-inch Smart OLED Television vide Invoice #RET/DEL/2023/9412'}"
   bearing manufacturer full comprehensive warranty for 2 years.

2. That within weeks of purchase, the equipment suffered catastrophic functional defects as detailed below:
   "${formData.defectNature || 'Severe vertical display banding, panel blackout, and intermittent motherboard shutdown rendering the appliance non-functional.'}"

3. That despite service inspection tickets confirming internal component breakdown, your customer support desk arbitrarily repudiated the warranty claim, amounting to gross deficiency of service under Section 2(11) of the Consumer Protection Act, 2019.

4. YOU ARE HEREBY CALLED UPON to remedy the defect by delivering a brand new sealed replacement unit or refunding the full invoice sum along with damages totaling ${formData.claimAmount || '₹ 1,85,000/-'} within ${formData.curePeriod || '15 Days'} of receipt of this notice, failing which my client shall institute formal proceedings before the Hon'ble Consumer Disputes Redressal Commission entirely at your risk, cost, and consequence.

Yours faithfully,

Adv. Anita Deshmukh (Enrolment: D/1429/2012)
Advocate & Legal Consultant
Counsel for ${formData.clientName || 'Ms. Meera Sharma'}`;
  }

  // Affidavit
  return `AFFIDAVIT
BEFORE THE ${formData.courtName?.toUpperCase() || 'HON\'BLE COMMISSION'}
IN THE MATTER OF: ${formData.caseNumber || 'CC/412/2026'}

I, ${formData.deponentName || 'Meera Sharma'}, aged about ${formData.deponentAge || '36 Years'}, residing at ${formData.deponentAddress || 'B-42, Gulmohar Park, New Delhi'}, do hereby solemnly affirm and declare on oath as under:

1. That I am the Complainant in the above-titled matter and am fully conversant with the facts and circumstances of the case, and as such competent to swear this affidavit.
2. That the contents of the accompanying Complaint and Documents are true to my knowledge and based on records maintained in normal course of transactions.
3. In compliance with Bharatiya Sakshya Adhiniyam 2023, the attached electronic tax invoices, emails, and service logs are true and untampered reproductions of the original electronic records generated on my personal mobile device and email server.

DEPONENT
Verified at New Delhi on this ${currentDate} that the contents of paragraphs 1 to 3 above are true and correct.`;
}

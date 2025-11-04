-- Legal Document Templates
-- Run this AFTER migration.sql in Supabase SQL Editor

INSERT INTO public.templates (name, description, category, content) VALUES

-- Employment Templates
('Employment Contract', 'Standard employment agreement template', 'Employment', 'EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is entered into on [DATE] between [COMPANY NAME] ("Employer") and [EMPLOYEE NAME] ("Employee").

1. POSITION AND DUTIES
Employee is hired as [POSITION TITLE] and shall perform duties as assigned by Employer.

2. COMPENSATION
Employee shall receive [SALARY/HOURLY RATE] paid [PAYMENT SCHEDULE].

3. BENEFITS
Employee is entitled to [BENEFITS DESCRIPTION].

4. TERM
This agreement begins on [START DATE] and continues until terminated.

5. TERMINATION
Either party may terminate this agreement with [NOTICE PERIOD] notice.

Signed: ___________________
Date: ___________________'),

('Non-Disclosure Agreement (NDA)', 'Confidentiality agreement for sensitive information', 'Business', 'NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is made on [DATE] between:
- [DISCLOSING PARTY NAME] ("Disclosing Party")
- [RECEIVING PARTY NAME] ("Receiving Party")

1. CONFIDENTIAL INFORMATION
The Receiving Party acknowledges that they may receive proprietary information from the Disclosing Party.

2. OBLIGATIONS
The Receiving Party agrees to:
- Keep all information confidential
- Use information only for authorized purposes
- Not disclose to third parties without written consent

3. TERM
This agreement remains in effect for [DURATION] years from the date of signing.

4. RETURN OF MATERIALS
Upon termination, all materials must be returned or destroyed.

Signed: ___________________
Date: ___________________'),

-- Business Templates
('Service Agreement', 'Professional services contract', 'Business', 'SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into on [DATE] between:
- [SERVICE PROVIDER NAME] ("Provider")
- [CLIENT NAME] ("Client")

1. SERVICES
Provider agrees to provide the following services: [DESCRIPTION]

2. PAYMENT
Client agrees to pay [AMOUNT] according to the following schedule: [PAYMENT TERMS]

3. TERM
Services shall commence on [START DATE] and continue until [END DATE] or completion.

4. TERMINATION
Either party may terminate with [NOTICE PERIOD] written notice.

5. LIABILITY
Provider\'s liability is limited to the amount paid for services.

Signed: ___________________
Date: ___________________'),

('Purchase Agreement', 'Agreement for buying/selling goods or services', 'Business', 'PURCHASE AGREEMENT

This Purchase Agreement is made on [DATE] between:
- Seller: [SELLER NAME]
- Buyer: [BUYER NAME]

1. GOODS/SERVICES
Seller agrees to sell and Buyer agrees to purchase: [DESCRIPTION]

2. PURCHASE PRICE
Total price: [AMOUNT]
Payment method: [PAYMENT METHOD]

3. DELIVERY
Delivery date: [DATE]
Delivery location: [LOCATION]

4. WARRANTIES
Seller warrants that goods/services are: [WARRANTY TERMS]

5. RETURNS
Return policy: [RETURN POLICY]

Signed: ___________________
Date: ___________________'),

-- Legal Templates
('Power of Attorney', 'Authorization to act on behalf of another', 'Legal', 'POWER OF ATTORNEY

I, [PRINCIPAL NAME], of [ADDRESS], hereby appoint [AGENT NAME] as my attorney-in-fact.

1. POWERS GRANTED
My agent is authorized to:
[LIST OF POWERS]

2. EFFECTIVE DATE
This Power of Attorney is effective immediately and shall continue until: [DATE/CONDITION]

3. REVOCATION
I reserve the right to revoke this Power of Attorney at any time.

4. THIRD PARTY RELIANCE
Third parties may rely on this document without liability.

Signed: ___________________
Date: ___________________
Witness: ___________________'),

('Lease Agreement', 'Residential or commercial property lease', 'Real Estate', 'LEASE AGREEMENT

This Lease Agreement is made on [DATE] between:
- Landlord: [LANDLORD NAME]
- Tenant: [TENANT NAME]

1. PROPERTY
Address: [PROPERTY ADDRESS]
Type: [RESIDENTIAL/COMMERCIAL]

2. TERM
Lease begins: [START DATE]
Lease ends: [END DATE]

3. RENT
Monthly rent: [AMOUNT]
Due date: [DAY] of each month
Late fee: [AMOUNT]

4. SECURITY DEPOSIT
Amount: [AMOUNT]
Conditions for return: [TERMS]

5. RESPONSIBILITIES
Landlord responsibilities: [LIST]
Tenant responsibilities: [LIST]

Signed: ___________________
Date: ___________________'),

-- Financial Templates  
('Promissory Note', 'Promise to repay a loan', 'Financial', 'PROMISSORY NOTE

Principal Amount: [AMOUNT]
Date: [DATE]

FOR VALUE RECEIVED, [BORROWER NAME] ("Borrower") promises to pay [LENDER NAME] ("Lender") the principal sum of [AMOUNT].

1. INTEREST
Interest rate: [RATE]% per annum

2. PAYMENT SCHEDULE
[PAYMENT SCHEDULE DETAILS]

3. MATURITY DATE
Full payment due: [DATE]

4. DEFAULT
If Borrower fails to make payment, Lender may declare entire amount due immediately.

5. PREPAYMENT
Borrower may prepay without penalty.

Signed: ___________________
Date: ___________________'),

('Invoice Template', 'Professional invoice for goods or services', 'Financial', 'INVOICE

Invoice #: [NUMBER]
Date: [DATE]
Due Date: [DUE DATE]

From:
[YOUR COMPANY NAME]
[ADDRESS]
[CONTACT INFO]

To:
[CLIENT NAME]
[ADDRESS]
[CONTACT INFO]

DESCRIPTION | QUANTITY | RATE | AMOUNT
[LINE ITEMS]

Subtotal: [AMOUNT]
Tax: [AMOUNT]
Total: [AMOUNT]

PAYMENT TERMS:
Payment due within [DAYS] days
Late fee: [PERCENTAGE]% after due date

Payment methods: [PAYMENT OPTIONS]'),

-- Contract Templates
('Independent Contractor Agreement', 'Agreement for freelance/contract work', 'Business', 'INDEPENDENT CONTRACTOR AGREEMENT

This Agreement is made on [DATE] between:
- Company: [COMPANY NAME]
- Contractor: [CONTRACTOR NAME]

1. SERVICES
Contractor shall provide: [DESCRIPTION OF SERVICES]

2. COMPENSATION
Payment: [AMOUNT]
Payment schedule: [SCHEDULE]

3. RELATIONSHIP
Contractor is an independent contractor, not an employee.

4. INTELLECTUAL PROPERTY
All work product belongs to: [COMPANY/CONTRACTOR]

5. CONFIDENTIALITY
Contractor agrees to maintain confidentiality of company information.

6. TERM AND TERMINATION
Agreement begins: [DATE]
Either party may terminate with [NOTICE PERIOD] notice.

Signed: ___________________
Date: ___________________'),

('Partnership Agreement', 'Agreement between business partners', 'Business', 'PARTNERSHIP AGREEMENT

This Partnership Agreement is made on [DATE] between:
[PARTNER 1 NAME] and [PARTNER 2 NAME]

1. BUSINESS NAME
The partnership shall operate under the name: [BUSINESS NAME]

2. PURPOSE
The partnership is formed to: [PURPOSE]

3. CAPITAL CONTRIBUTIONS
Partner 1: [AMOUNT]
Partner 2: [AMOUNT]

4. PROFIT AND LOSS SHARING
Profits and losses shall be shared: [PERCENTAGE] / [PERCENTAGE]

5. MANAGEMENT
Partners shall have equal management rights unless otherwise agreed.

6. DISSOLUTION
Partnership may be dissolved by: [TERMS]

Signed: ___________________
Date: ___________________'),

-- Policy Templates
('Privacy Policy', 'Website/app privacy policy template', 'Policy', 'PRIVACY POLICY

Effective Date: [DATE]

[COMPANY NAME] ("we," "us," "our") respects your privacy.

1. INFORMATION WE COLLECT
We collect: [TYPES OF DATA]

2. HOW WE USE INFORMATION
We use information to:
- Provide services
- Improve user experience
- Send updates and notifications

3. INFORMATION SHARING
We do not sell personal information.
We may share with: [THIRD PARTIES]

4. DATA SECURITY
We implement security measures to protect your data.

5. YOUR RIGHTS
You have the right to:
- Access your data
- Request deletion
- Opt out of communications

6. CONTACT
Questions? Contact us at: [CONTACT INFO]'),

('Terms of Service', 'Website/app terms and conditions', 'Policy', 'TERMS OF SERVICE

Last Updated: [DATE]

1. ACCEPTANCE OF TERMS
By using [SERVICE NAME], you agree to these terms.

2. USE OF SERVICE
You agree to:
- Use service legally
- Not violate others\' rights
- Comply with all applicable laws

3. USER ACCOUNTS
You are responsible for:
- Account security
- All activity under your account

4. INTELLECTUAL PROPERTY
All content is owned by [COMPANY NAME] or licensors.

5. LIMITATION OF LIABILITY
Service is provided "as is" without warranties.

6. TERMINATION
We may suspend or terminate accounts for violations.

7. CHANGES TO TERMS
We reserve the right to modify these terms.

8. CONTACT
Questions? Contact: [CONTACT INFO]'),

-- Additional Templates
('Consulting Agreement', 'Professional consulting services contract', 'Business', 'CONSULTING AGREEMENT

This Consulting Agreement is made on [DATE] between:
- Client: [CLIENT NAME]
- Consultant: [CONSULTANT NAME]

1. SERVICES
Consultant agrees to provide: [DESCRIPTION]

2. FEES
Consulting fee: [AMOUNT]
Payment terms: [SCHEDULE]

3. EXPENSES
Reimbursable expenses: [TERMS]

4. DELIVERABLES
Consultant shall deliver: [DELIVERABLES]

5. TIMELINE
Project timeline: [DATES]

6. CONFIDENTIALITY
Both parties agree to maintain confidentiality.

7. OWNERSHIP
Work product ownership: [TERMS]

Signed: ___________________
Date: ___________________'),

('Liability Waiver', 'Release of liability form', 'Legal', 'LIABILITY WAIVER AND RELEASE

I, [PARTICIPANT NAME], voluntarily participate in [ACTIVITY/EVENT].

1. ASSUMPTION OF RISK
I understand and assume all risks associated with participation.

2. RELEASE OF LIABILITY
I release [ORGANIZATION NAME] from all claims, damages, and liabilities.

3. INDEMNIFICATION
I agree to indemnify [ORGANIZATION NAME] against any claims arising from my participation.

4. MEDICAL AUTHORIZATION
In case of emergency, I authorize [ORGANIZATION NAME] to obtain medical treatment.

5. PHOTO RELEASE
I consent to use of photos/videos taken during participation.

Signed: ___________________
Date: ___________________
Emergency Contact: ___________________'),

('Sales Contract', 'Agreement for sale of goods', 'Business', 'SALES CONTRACT

This Sales Contract is made on [DATE] between:
- Seller: [SELLER NAME]
- Buyer: [BUYER NAME]

1. GOODS
Description: [DETAILED DESCRIPTION]
Quantity: [AMOUNT]
Quality: [SPECIFICATIONS]

2. PRICE
Total price: [AMOUNT]
Payment method: [METHOD]
Payment schedule: [SCHEDULE]

3. DELIVERY
Delivery date: [DATE]
Shipping method: [METHOD]
Delivery location: [ADDRESS]

4. INSPECTION
Buyer may inspect within [DAYS] days of delivery.

5. WARRANTIES
Seller warrants: [WARRANTY TERMS]

6. RISK OF LOSS
Risk transfers upon: [DELIVERY/PAYMENT]

Signed: ___________________
Date: ___________________');

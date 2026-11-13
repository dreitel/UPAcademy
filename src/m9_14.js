  PAGES.m9 = function () {
    return `<p class="eyebrow">Part C · Module 9</p><h1>Order entry in 1C</h1>
      <div class="meta"><span><b>Time</b> about 50 min</span><span><b>Ends with</b> 7-question quiz</span></div>
      <p class="lead">How to turn an order into a correct invoice in 1C: the fields, the product set, cuts, shipping, discounts, reserving and printing, plus the mistakes that ship wrong doors.</p>
      <div class="goals"><h3>By the end you can</h3><ul>
        <li>Create a sales invoice with the right customer, numbers and schema.</li>
        <li>Add a product set, add-ons and cuts.</li>
        <li>Add shipping and the dealer discount correctly.</li>
        <li>Reserve, save and print the invoice.</li>
        <li>Avoid the entry mistakes that send the wrong door.</li></ul></div>

      <h2>Before you open 1C</h2>
      <p>From the order email or your notes, collect:</p>
      <ul class="plain">
        <li>Customer full name, <b>phone number</b>, delivery address and state.</li>
        <li>Dealer name and order number, if it is a dealer order.</li>
        <li>Product SKU, width, and any custom height or width.</li>
        <li>Add-ons such as soft close, handles and locks.</li>
        <li>The retail price on unitedporte.us for the set and add-ons, so you can check the invoice total at the end.</li>
      </ul>

      <h2>Step by step</h2>
      <ol class="steps">
        <li><b>Create.</b> Go to Sales → SALES → Create.</li>
        <li><b>Header.</b> Customer (search, or create new); incoming number (dealer prefix + order number, for example MCD1549); sales schema; shipping address; ship-by date.</li>
        <li><b>Product.</b> Select goods → search the SKU → double-click. The SET row appears with its sub-items. Check the panel count matches the number of slabs.</li>
        <li><b>Add-ons.</b> Use "Add into set" on the SET row. On every double bypass, soft close quantity is 2, one per side.</li>
        <li><b>Cuts.</b> Click the gear on the SET row and fill the cut type and "Cut to" sizes for each panel.</li>
        <li><b>Shipping.</b> "Add free item/serv." → SHIPPING, quantity 1, price by state and door type. No discount on this line.</li>
        <li><b>Dealer discount.</b> Prices and discounts → Apply max discounts. Cut lines need the discount entered by hand.</li>
        <li><b>Check.</b> The set total must equal the website retail total.</li>
        <li><b>Reserve.</b> Reserve → 15 days.</li>
        <li><b>Save and print.</b> Print → Invoice(old). Answer Yes to save, OK to the tax recalculation, OK to post. Save the PDF named with the invoice number.</li>
      </ol>

      <h2>Sales schema</h2>
      <div class="tablewrap"><table><thead><tr><th>Use</th><th>For</th></tr></thead><tbody>
        <tr><td>Our delivery</td><td>A customer, or a dealer's showroom</td></tr>
        <tr><td>Movement</td><td>Only for United Porte's own showrooms</td></tr>
        <tr><td>Exhibition</td><td>Never for a customer order</td></tr>
      </tbody></table></div>

      <h2>Cuts</h2>
      <div class="tablewrap"><table><thead><tr><th>Door</th><th>Height cut</th><th>Width cut</th></tr></thead><tbody>
        <tr><td>Standard solid door</td><td><code>B1</code> bottom only</td><td><code>B5</code> one side</td></tr>
        <tr><td>Glass or mirror in the middle (for example the 1299 series)</td><td><code>B2</code> top and bottom</td><td><code>B6</code> both sides</td></tr>
      </tbody></table></div>
      <ul class="plain">
        <li>The custom size fee goes into the cut line prices, never as a separate item. Example: $75 per slab, split across the height and width cut lines.</li>
        <li>Enter the <b>exact finished slab size</b> for every panel. Never the opening size.</li>
        <li>Cutting instructions go in the <b>works comments</b>. "Comments for print" are not seen by production.</li>
        <li>Write a comment for <b>each</b> door. A single checkbox cuts only one door.</li>
        <li>Changing a line's quantity does <b>not</b> copy the works to the new doors. Re-check them.</li>
        <li>If a door's size changes, change the frame and trim sizes too.</li>
        <li>Bypass doors: write "cut round pull on ONE side only" in the warehouse notes, or the pull is cut on both faces.</li>
      </ul>
      ${fact("orange", "Three slips have shipped wrong doors before: the opening size written instead of the slab size, a cut typed in the print comments, and a quantity changed without re-checking the works.")}

      <h2>Handles and locks on the invoice</h2>
      <ul class="plain">
        <li><code>CYL</code> and <code>WC</code> items are only the cover and cylinder. Add the magnetic lock and striker as separate lines.</li>
        <li>If you add a handle without a lock function, the door arrives as passage and will not lock.</li>
        <li>Work codes: <code>C2</code> = Europe handle with magnetic lock, passage. <code>C3</code> = Europe handle with magnetic lock, privacy or entry.</li>
        <li>The cylinder cut must be on <b>every</b> door that needs it, not just the first.</li>
        <li>Double doors: works row 1 is the left leaf, row 2 the right. Add 2 flush bolts.</li>
      </ul>

      <h2>Mistakes to avoid</h2>
      <div class="tablewrap"><table><thead><tr><th>Problem</th><th>How to avoid it</th></tr></thead><tbody>
        <tr><td>Blank rows appear</td><td>Click the Price or discount column, never the Goods column, when editing.</td></tr>
        <tr><td>Tax changes after charging</td><td>Set the shipping method and the full address before you charge.</td></tr>
        <tr><td>No delivery text messages</td><td>Never finish an invoice without a phone number. Email notices go only if the email field is filled.</td></tr>
        <tr><td>Can't change a posted invoice</td><td>Once posted or sent for packing it is locked. Ask ops for changes; a new fulfilment needs a new invoice.</td></tr>
        <tr><td>Order cancelled by itself</td><td>Reserves last 15 days at most and can lapse. When one expires, 1C cancels the invoice. Watch your reserves.</td></tr>
        <tr><td>Custom item not in 1C</td><td>Enter a similar stock door, describe the real item in the comments, and set the correct price.</td></tr>
        <tr><td>"Division by zero" error</td><td>Click OK; it is harmless.</td></tr>
      </tbody></table></div>
      <div class="rule"><strong>Write everything in 1C</strong><p>Every special request, cut, color and promise goes into the 1C comment. Ops handles hundreds of orders and cannot remember what was agreed in a chat.</p></div>
      ${fact("blue", "A green check on the invoice means the warehouse accepted what is on it. Accounting will not apply a payment until that check is there.")}

      <h2>Hands-on tasks</h2>
      ${tasks("m9", [
        "Watch your trainer enter a complete dealer order in 1C from start to finish.",
        "Enter a practice invoice for a double bypass door with soft close and a custom height.",
        "Print Invoice(old) and check every line against the website retail total.",
        "Find your open reserves and check their expiry dates."
      ])}

      <h2>Quiz</h2>
      ${quiz([
        { q: "Which sales schema do you use for a customer delivery?", o: ["Exhibition", "Movement", "Our delivery", "Any"], a: 2, why: "Our delivery is for customers and dealers' showrooms. Movement is only for our own showrooms. Never Exhibition." },
        { q: "Where do cutting instructions go?", o: ["Comments for print", "The works comments", "An email to the warehouse", "The invoice title"], a: 1, why: "Production does not see comments for print." },
        { q: "Which cut type for a mirror door's height?", o: ["B1 bottom only", "B2 top and bottom", "B5 one side", "None"], a: 1, why: "Doors with glass or mirror in the middle are cut top and bottom, B2, and both sides, B6." },
        { q: "How many soft close kits on a double bypass?", o: ["1", "2", "4", "0"], a: 1, why: "Quantity 2 on every double bypass: one per side." },
        { q: "You add a WC item for a privacy handle. What else is needed?", o: ["Nothing", "The magnetic lock and striker as separate lines", "A deadbolt", "A new invoice"], a: 1, why: "WC and CYL items are only the cover and cylinder." },
        { q: "Should shipping get the dealer discount?", o: ["Yes", "No", "Only in zone A", "Only on doubles"], a: 1, why: "Shipping is never discounted." },
        { q: "How long can a reserve last?", o: ["Forever", "15 days at most", "30 days", "90 days"], a: 1, why: "Reserves last 15 days at most, and 1C cancels the invoice when they expire." }
      ])}
      ${completeBox("m9")}${pager("m9")}`;
  };

  PAGES.m10 = function () {
    return `<p class="eyebrow">Part C · Module 10</p><h1>Payment, credit and fraud</h1>
      <div class="meta"><span><b>Time</b> about 25 min</span><span><b>Ends with</b> 6-question quiz</span></div>
      <p class="lead">How customers pay, the rules for dealer credit, how to protect a sale from chargebacks, and the warning signs of fraud.</p>
      <div class="goals"><h3>By the end you can</h3><ul>
        <li>Tell customers how and when to pay.</li>
        <li>Know when an order can and cannot ship.</li>
        <li>Keep the records that win chargeback disputes.</li>
        <li>Spot a likely scam order.</li></ul></div>

      <h2>How customers pay</h2>
      <div class="tablewrap"><table><thead><tr><th>Method</th><th>Notes</th></tr></thead><tbody>
        <tr><td>Card on the website</td><td>Visa, Discover, Amex, Amazon Pay.</td></tr>
        <tr><td>Affirm financing</td><td>Website checkout only.</td></tr>
        <tr><td>Company check or wire</td><td>Payable to "United Porte Inc".</td></tr>
      </tbody></table></div>
      <div class="rule"><strong>Payment first</strong><p>Our terms ask for payment when the order is placed, for stock and custom orders. Production and cuts start only after payment. Any exception needs approval.</p></div>

      <h2>Storage and unpaid orders</h2>
      <ul class="plain">
        <li>Orders must ship within 30 days of the invoice.</li>
        <li>Stored longer: a 10% storage fee per week. After 60 days the order can be cancelled.</li>
        <li>Overdue accounts: 10% monthly interest after 30 days.</li>
        <li>Tax-exempt customers: ask Valentina for the documents we need.</li>
      </ul>

      <h2>Dealer credit</h2>
      <p>We no longer ship dealer invoices without payment. Releasing a held order for a dealer with unpaid balances needs approval from Inti or Vlad. Storage fees are the tool for orders that are not collected.</p>
      ${fact("green", "Every call is recorded. For anything unusual, a price exception, a promised date or a special cut, get the customer's approval by email as well.")}

      <h2>Chargebacks</h2>
      <p>A chargeback is when a card customer asks their bank to reverse a payment. We can fight one with records.</p>
      <ul class="plain">
        <li>Keep the signed delivery receipt or the pick-up record. Driver delivery photos are saved in 1C.</li>
        <li>Keep email approvals for the order details.</li>
        <li>For customers with chargeback risk, require ACH or check in full before sending a replacement.</li>
        <li>"Not received" chargebacks after a contractor collected the order: fight them with the pick-up record.</li>
      </ul>

      <h2>Fraud warning signs</h2>
      <div class="tablewrap"><table><thead><tr><th>Sign</th><th>What to do</th></tr></thead><tbody>
        <tr><td>International shipping request with the customer's own freight forwarder</td><td>Treat as a likely scam. The goods leave and the payment is reversed. Talk to your manager.</td></tr>
        <tr><td>Large first order, rushed, from a new customer</td><td>Search the name, address and phone online before you accept.</td></tr>
        <tr><td>Links sent in chat, even from a known coworker's account</td><td>Don't click. Accounts get hacked. Confirm by phone.</td></tr>
        <tr><td>Address that doesn't match the card or the business</td><td>Ask for verification before you ship.</td></tr>
      </tbody></table></div>
      ${fact("orange", "A real scam pattern in our industry: a big order, the buyer's own freight forwarder picks up, the goods leave the country, and the card payment is reversed weeks later.")}

      <h2>Hands-on tasks</h2>
      ${tasks("m10", [
        "Ask accounting how they apply a wire and a check to an invoice.",
        "Find the driver delivery photos on a delivered order in 1C.",
        "Look up a recent large order's address and phone online, as a practice check."
      ])}

      <h2>Quiz</h2>
      ${quiz([
        { q: "When does production or cutting start?", o: ["When the order is entered", "After payment", "After delivery", "When the customer calls"], a: 1, why: "Production and cuts start only after payment." },
        { q: "Can Affirm be used for a showroom invoice?", o: ["Yes", "No, Affirm is website checkout only", "Only for dealers", "Only for custom orders"], a: 1, why: "Affirm is available on the website only." },
        { q: "A paid order sits uncollected for 5 weeks. What applies?", o: ["Nothing", "A 10% storage fee per week after 30 days", "Free storage", "Automatic refund"], a: 1, why: "Orders must ship within 30 days; after that, 10% per week." },
        { q: "A new customer wants a big order shipped to their freight forwarder overseas. What do you do?", o: ["Ship it fast", "Treat it as a likely scam and talk to your manager", "Offer a discount", "Ask for a card"], a: 1, why: "This is the most common scam pattern." },
        { q: "A coworker's chat account sends you a link. What do you do?", o: ["Click it", "Confirm with them by phone first", "Forward it", "Ignore all messages"], a: 1, why: "Accounts get hacked." },
        { q: "What helps most to fight a 'not received' chargeback?", o: ["A phone call", "The signed delivery receipt or pick-up record", "An apology", "A discount"], a: 1, why: "Delivery and pick-up records are the evidence." }
      ])}
      ${completeBox("m10")}${pager("m10")}`;
  };

  PAGES.m11 = function () {
    return `<p class="eyebrow">Part C · Module 11</p><h1>Delivery, pick-up and receiving</h1>
      <div class="meta"><span><b>Time</b> about 25 min</span><span><b>Ends with</b> 6-question quiz</span></div>
      <p class="lead">How orders travel, what the customer must do when they arrive, and the 48-hour rule that decides every damage claim.</p>
      <div class="goals"><h3>By the end you can</h3><ul>
        <li>Explain curbside freight, parcel and pick-up.</li>
        <li>Set up a pick-up correctly.</li>
        <li>Prepare customers for buildings that need insurance papers.</li>
        <li>Tell every customer how to inspect their order.</li></ul></div>

      <h2>How orders travel</h2>
      <div class="tablewrap"><table><thead><tr><th>Method</th><th>Used for</th><th>Know this</th></tr></thead><tbody>
        <tr><td>Our trucks</td><td>Most door orders in our regions</td><td>Routes close in the morning; give a range, not a route date.</td></tr>
        <tr><td>Freight carrier (LTL)</td><td>Large items outside our routes</td><td>Curbside delivery only. Lift gate and inside delivery cost extra.</td></tr>
        <tr><td>Parcel (UPS, FedEx, USPS)</td><td>Hardware and small items</td><td>Anything 96 in. or longer costs about $150 more by UPS.</td></tr>
        <tr><td>Showroom pick-up</td><td>Customers who collect</td><td>By appointment only, during that showroom's hours.</td></tr>
      </tbody></table></div>
      <ul class="plain">
        <li>Freight is counted in slabs: a double door is 2 slabs.</li>
        <li>Inside or upstairs delivery: about $10 per slab per floor.</li>
        <li>Dealers may use their own freight.</li>
        <li>At delivery the customer gets a packing slip, never a priced invoice.</li>
      </ul>

      <h2>Pick-up</h2>
      <ol class="steps">
        <li>Flag the order as pick-up when you place it.</li>
        <li>Book an appointment with the showroom.</li>
        <li>The driver or customer signs in at the front office.</li>
        <li>Inspect before leaving. Damage on a picked-up order stays with the customer.</li>
      </ol>

      <h2>Buildings that need insurance papers</h2>
      <p>Manhattan and many apartment buildings demand a Certificate of Insurance (COI) before a delivery, often at the last minute. We can get one from our broker, but it takes time. Ask for the building's COI template when you take the order.</p>
      ${fact("blue", "Missing a cylinder or hole caps? They ship in a small box inside the door packaging. Ask the customer to check there first. It solves most 'missing parts' calls.")}

      <h2>The 48-hour rule</h2>
      <div class="rule"><strong>Inspect within 48 hours</strong><p>Customers must open and inspect everything within 48 hours of delivery or pick-up. Missing parts and shipping damage reported later are not replaced. Tell every customer this when they order, and again when it ships.</p></div>
      <ol class="steps">
        <li>Before signing, look for visible damage and write it on the delivery receipt.</li>
        <li>Signing a clean receipt confirms the order arrived in good condition.</li>
        <li>Open every box within 48 hours and check for hidden damage.</li>
        <li>Report anything with photos right away.</li>
      </ol>
      <p>Freight carriers turn down almost every claim raised more than about 5 days after delivery, so speed matters.</p>
      <div class="code"><strong>What to tell the customer</strong><p>When your order arrives, please check every box for damage before you sign, and write any damage on the delivery receipt. Then open and inspect everything within 48 hours and send us photos of any problem. After 48 hours we can no longer replace missing or damaged items.</p></div>
      ${fact("orange", "An aluminium entry door with its frame weighs about 200 lbs, and double doors ship on a pallet of about 600 lbs. Customers should have help ready to unload.")}

      <h2>Hands-on tasks</h2>
      ${tasks("m11", [
        "Book a practice pick-up appointment with your showroom.",
        "Open a delivered door box with the warehouse and find the small parts box.",
        "Read the inspection message aloud to your trainer as if on a call."
      ])}

      <h2>Quiz</h2>
      ${quiz([
        { q: "Within how long must customers inspect their order?", o: ["30 days", "48 hours", "1 week", "Before installation, whenever"], a: 1, why: "Missing parts and damage are judged against 48 hours." },
        { q: "The driver hands over the order and the customer signs without checking. Damage is found later. What happened?", o: ["Nothing; we replace it", "The clean signature confirmed good condition, which weakens the claim", "The driver pays", "The warehouse pays"], a: 1, why: "Damage must be written on the receipt before signing." },
        { q: "Freight carriers deliver…", o: ["Inside, upstairs", "Curbside only", "To the room", "Installed"], a: 1, why: "Inside delivery and lift gate cost extra." },
        { q: "A Manhattan building asks for a COI. When should you ask for the template?", o: ["When you take the order", "On delivery day", "Never", "After delivery"], a: 0, why: "COIs take time from our broker." },
        { q: "A customer says the cylinder is missing. First step?", o: ["Ship a new door", "Ask them to check the small box inside the door packaging", "Refund", "Send an installer"], a: 1, why: "Small parts ship inside the door packaging." },
        { q: "How many slabs is a double door for freight?", o: ["1", "2", "3", "4"], a: 1, why: "Freight is counted in slabs." }
      ])}
      ${completeBox("m11")}${pager("m11")}`;
  };

  PAGES.m12 = function () {
    return `<p class="eyebrow">Part D · Module 12</p><h1>Returns, exchanges and claims</h1>
      <div class="meta"><span><b>Time</b> about 35 min</span><span><b>Ends with</b> 7-question quiz</span></div>
      <p class="lead">What can come back and what can't, the fees, the evidence we need, how to troubleshoot before calling something defective, and how to process an exchange.</p>
      <div class="goals"><h3>By the end you can</h3><ul>
        <li>Tell a customer if an item can be returned, and what it costs.</li>
        <li>Ask for the right photos or video.</li>
        <li>Troubleshoot the most common complaints.</li>
        <li>Set up an exchange correctly in 1C.</li></ul></div>

      <h2>Return rules</h2>
      <div class="tablewrap"><table><thead><tr><th>Rule</th><th>Detail</th></tr></thead><tbody>
        <tr><td>Window</td><td>30 days from delivery or pick-up. Missing parts and damage: 48 hours.</td></tr>
        <tr><td>Approval</td><td>Returns need written or email authorization first.</td></tr>
        <tr><td>Condition</td><td>Original packaging, unused, with proof of purchase.</td></tr>
        <tr><td>Restocking fee</td><td>25% under our terms. Waiving it is Inti's call.</td></tr>
        <tr><td>Shipping</td><td>Original and return shipping are not refunded.</td></tr>
        <tr><td>Handles not returned</td><td>$150 each is charged.</td></tr>
      </tbody></table></div>
      <div class="rule"><strong>Never returnable</strong><p>Special orders, custom and non-stock items, cut or altered items (including jambs), and items with factory cuts. Hidden and frameless doors are treated as custom.</p></div>

      <h2>Evidence we need</h2>
      <ul class="plain">
        <li><b>Damage:</b> photos of the damage and the whole door.</li>
        <li><b>Free replacement:</b> a video showing the problem.</li>
        <li><b>Color or finish differences:</b> photos of the factory stickers on each door.</li>
        <li><b>Exterior door leaks:</b> a photo of the whole door and its canopy.</li>
      </ul>
      ${fact("green", "For small scratches and dents, the usual fix is a touch-up kit, not a new door. It is faster for the customer and keeps their install on schedule.")}

      <h2>Troubleshoot first</h2>
      <p>Most complaints are adjustments, not defects. Walk the customer or installer through these first.</p>
      <div class="tablewrap"><table><thead><tr><th>Complaint</th><th>Check first</th></tr></thead><tbody>
        <tr><td>"The lock doesn't work."</td><td>Have the installer adjust the hinges and latch. This fixes almost every lock complaint.</td></tr>
        <tr><td>"Air comes through."</td><td>Adjust the hinges and the locking hooks.</td></tr>
        <tr><td>"The key won't turn" on a PVC door</td><td>Lift the handle up first, then turn the key.</td></tr>
        <tr><td>"Parts are missing."</td><td>Check the small box inside the door packaging.</td></tr>
        <tr><td>"Water gets in" on an exterior door</td><td>Is there a canopy over the door?</td></tr>
        <tr><td>"The glass is cracked."</td><td>Glass is not sold separately. A cracked glass panel means a new slab.</td></tr>
      </tbody></table></div>

      <h2>Exchanges in 1C</h2>
      <ul class="plain">
        <li>An exchange always needs a return document, created against the <b>original</b> order.</li>
        <li>The replacement invoice and the return must carry the <b>same price</b>, or the books show us owing the customer.</li>
        <li>Exception: if the old item can't come back (already installed, short-shipped, can't be collected), the replacement goes at $0.01 and the return is deleted.</li>
        <li>List only the items actually being replaced.</li>
        <li>If the warehouse picked the wrong item and the box is unopened, they swap it with no paperwork.</li>
      </ul>
      <div class="rule"><strong>When we are at fault</strong><p>We pay the installer's call-out. Repair visits go on a repair call invoice. Refunds are processed by accounting.</p></div>
      ${fact("blue", "Keep your own email trail on every return. Warehouse check-ins are sometimes missed, and ops accepts your emails as proof that an item came back.")}

      <h2>Hands-on tasks</h2>
      ${tasks("m12", [
        "Read the return and restocking section of our Terms of Sale.",
        "Watch your trainer create a return and an exchange in 1C.",
        "Role-play a 'the lock doesn't work' call and walk the customer through hinge adjustment."
      ])}

      <h2>Quiz</h2>
      ${quiz([
        { q: "How long do customers have to return an unopened stock door?", o: ["48 hours", "30 days", "90 days", "1 year"], a: 1, why: "30 days from delivery or pick-up. Damage and missing parts: 48 hours." },
        { q: "Can a door that was cut to size be returned?", o: ["Yes", "Yes, with 25% fee", "No, never", "Only within 48 hours"], a: 2, why: "Cut or altered items are never returnable." },
        { q: "What is the restocking fee under our terms?", o: ["0%", "10%", "25%", "50%"], a: 2, why: "25%. Waiving it is Inti's call." },
        { q: "A customer says the lock doesn't work. First step?", o: ["Send a new door", "Have the installer adjust hinges and latch", "Refund", "Replace the lock"], a: 1, why: "Almost every lock complaint is an adjustment." },
        { q: "What evidence do we need for a free replacement?", o: ["A phone call", "A video of the problem", "Nothing", "A letter"], a: 1, why: "Free replacements need video." },
        { q: "An exchange return document is created against…", o: ["The replacement invoice", "The original order", "Any order", "No order"], a: 1, why: "Always against the original order the goods came from." },
        { q: "A customer kept their handles when returning a door. What applies?", o: ["Nothing", "$150 per handle", "$15 per handle", "Full refund"], a: 1, why: "Unreturned handles are charged at $150 each." }
      ])}
      ${completeBox("m12")}${pager("m12")}`;
  };

  PAGES.m13 = function () {
    return `<p class="eyebrow">Part D · Module 13</p><h1>Warranty</h1>
      <div class="meta"><span><b>Time</b> about 25 min</span><span><b>Ends with</b> 6-question quiz</span></div>
      <p class="lead">What our warranty covers, what it doesn't, the install and storage rules that keep it valid, and how to file a claim.</p>
      <div class="goals"><h3>By the end you can</h3><ul>
        <li>State the warranty period for each product.</li>
        <li>Name the main exclusions.</li>
        <li>Tell customers how to store and install doors to keep the warranty.</li>
        <li>Collect everything needed for a claim.</li></ul></div>

      <h2>Coverage</h2>
      <div class="tablewrap"><table><thead><tr><th>Product</th><th>Warranty</th></tr></thead><tbody>
        <tr><td>Doors</td><td>2 years from purchase or delivery</td></tr>
        <tr><td>Factory finishes (painted, PPL, eco-veneer)</td><td>1 year against peeling, checking and cracking</td></tr>
        <tr><td>Vanities</td><td>1 year</td></tr>
        <tr><td>Electric and smart locks</td><td>1 year</td></tr>
        <tr><td>Primer</td><td>Not covered. Primer is not a finish.</td></tr>
      </tbody></table></div>
      <p>The door warranty is for the original buyer only and cannot be transferred. It covers doors installed in US homes.</p>

      <h2>What is not covered</h2>
      <ul class="plain">
        <li>Exterior doors without a canopy or overhang above them.</li>
        <li>Improper installation, storage, care or finishing, including third-party installs that don't follow our instructions.</li>
        <li>Damage from sun, water, heat or humidity, or from installing while plaster or cement is still wet.</li>
        <li>Holes or cuts made by others, and locks or hardware that are not ours.</li>
        <li>Finishes applied after delivery, and normal wear.</li>
        <li>Small color or texture differences in factory finishes, and slight swelling or shrinking with the seasons.</li>
      </ul>
      ${fact("orange", "Doors are wood products and move with the air. We specify 25 to 55% humidity and 50 to 90°F for storage and installation.")}

      <h2>Allowed tolerances</h2>
      <div class="tablewrap"><table><thead><tr><th>Measure</th><th>Allowed</th></tr></thead><tbody>
        <tr><td>Width, height, thickness</td><td class="num">± 1/8 in.</td></tr>
        <tr><td>Square, corner to corner</td><td class="num">± 1/8 in.</td></tr>
        <tr><td>Warp, across a section up to 42 x 96 in.</td><td class="num">up to 1/4 in.</td></tr>
      </tbody></table></div>
      <p>A door within these limits is not defective.</p>

      <h2>Storage and installation rules</h2>
      <ul class="plain">
        <li>Store doors flat and fully supported, never leaning. Keep the spacers between doors until they are hung.</li>
        <li>Deliver only after plaster, drywall and cement are dry.</li>
        <li>Use 2 hinges up to 80 in., and 3 hinges up to 90 in.</li>
        <li>When fitting on site: trim the width equally from both sides, at most 1/8 in. per side. Never trim the top. No more than 1/4 in. off the bottom without extra blocking.</li>
      </ul>
      ${fact("green", "If a door arrives with a slight warp, we may wait up to 12 months before deciding a claim. Many doors settle once they adjust to the home.")}

      <h2>Filing a claim</h2>
      <p>The customer emails <b>sales@unitedporte.us</b> with:</p>
      <ol class="steps">
        <li>A description and photos of the problem.</li>
        <li>The address where the door is installed, and the builder or installer.</li>
        <li>Proof of purchase and the install date.</li>
        <li>A short explanation, and confirmation that none of the exclusions caused it.</li>
      </ol>
      <div class="rule"><strong>What we do</strong><p>We choose to repair, replace or refund the original price. We do not pay for labor, re-hanging, refinishing or painting, and our limit is the original purchase price.</p></div>

      <h2>Hands-on tasks</h2>
      ${tasks("m13", [
        "Read the full warranty page on unitedporte.us.",
        "Check how doors are stored in the warehouse against the storage rules.",
        "Draft a reply to a warranty claim that is missing photos."
      ])}

      <h2>Quiz</h2>
      ${quiz([
        { q: "How long is the door warranty?", o: ["1 year", "2 years", "5 years", "Lifetime"], a: 1, why: "2 years from purchase or delivery." },
        { q: "A primed door's surface peels. Covered?", o: ["Yes", "No, primer is not a finish", "Only for 1 year", "Only outdoors"], a: 1, why: "Primer is not warranted." },
        { q: "An exterior door with no overhang leaks. Covered?", o: ["Yes", "No, a canopy is required", "Half", "Only the glass"], a: 1, why: "No overhead protection voids exterior door coverage." },
        { q: "How much warp is allowed?", o: ["None", "Up to 1/4 in.", "Up to 1 in.", "Up to 1/2 in."], a: 1, why: "Up to 1/4 in. across a section up to 42 x 96 in." },
        { q: "How many hinges on a 90 in. door?", o: ["2", "3", "4", "1"], a: 1, why: "2 hinges up to 80 in., 3 up to 90 in." },
        { q: "Can the warranty be transferred to a new owner?", o: ["Yes", "No, original buyer only", "With a fee", "After 1 year"], a: 1, why: "It is non-transferable." }
      ])}
      ${completeBox("m13")}${pager("m13")}`;
  };

  PAGES.m14 = function () {
    return `<p class="eyebrow">Part D · Module 14</p><h1>Dealer program</h1>
      <div class="meta"><span><b>Time</b> about 25 min</span><span><b>Ends with</b> 6-question quiz</span></div>
      <p class="lead">How dealers buy from us, their pricing and obligations, opening an account, partnership formats, and handling dealer escalations.</p>
      <div class="goals"><h3>By the end you can</h3><ul>
        <li>Explain how dealer pricing works.</li>
        <li>List what a dealer must do to sell our products.</li>
        <li>Open a dealer account.</li>
        <li>Handle a dealer escalation calmly and by the rules.</li></ul></div>

      <h2>Dealer pricing</h2>
      <ul class="plain">
        <li>Website prices are the retail baseline. The dealer discount is applied on the invoice, never worked out from the website.</li>
        <li>Discount levels are set per account. Ask your manager for a dealer's level before you quote.</li>
        <li>A dealer discount applies on top of a promo price.</li>
        <li>Shipping is never discounted, including expedited shipping.</li>
        <li>Pricing can change for dealers whose purchases in the last 6 months are under $75,000.</li>
        <li>A dealer's discount on a website or Affirm order is paid back as a credit.</li>
      </ul>

      <h2>Dealer obligations</h2>
      <ul class="plain">
        <li>Advertise under the United Porte name and use our model names and descriptions.</li>
        <li>Email photos of their showroom displays to sales@unitedporte.us.</li>
        <li>Pay before orders ship.</li>
        <li>Dealers can use their own freight if they prefer.</li>
      </ul>

      <h2>Opening a dealer account</h2>
      <ol class="steps">
        <li>The dealer fills in the United Porte application form.</li>
        <li>They sign our Terms and Conditions.</li>
        <li>Your manager sets their discount level.</li>
        <li>Orders are entered in 1C with the dealer's prefix and order number.</li>
      </ol>
      ${fact("blue", "Dealer orders in 1C carry the dealer's prefix in the invoice number, so My City Doors order 1549 becomes MCD1549.")}

      <h2>Partnership formats</h2>
      <p>Businesses that want to open their own United Porte store can join the partnership program.</p>
      <div class="tablewrap"><table><thead><tr><th>Format</th><th>Size</th><th>Products</th><th>Investment</th><th>Opening time</th></tr></thead><tbody>
        <tr><td>Mini</td><td class="num">377–538 sq ft</td><td>Interior and exterior doors</td><td class="num">from $50,000</td><td>1.5–2 months</td></tr>
        <tr><td>Classic</td><td class="num">646–861 sq ft</td><td>Doors plus kitchen or bathroom</td><td class="num">from $75,000</td><td>2–3 months</td></tr>
        <tr><td>Exclusive</td><td class="num">861–1,292 sq ft</td><td>Doors, kitchen, bathroom, windows</td><td class="num">from $100,000</td><td>3–4 months</td></tr>
      </tbody></table></div>
      <p>Partners get store design, software, training, sales scripts, marketing support and an online store.</p>

      <h2>Handling dealer escalations</h2>
      <ul class="plain">
        <li>Stay factual and polite. Answer in writing.</li>
        <li>Check the terms before you reply: payment, 48-hour inspection, restocking, storage.</li>
        <li>Do not promise exceptions yourself. Discounts, waivers and releases of held orders go to Inti or Vlad.</li>
        <li>Time-barred damage claims: the dealer pays at least half of the reshipping.</li>
        <li>Keep every email; they are your record.</li>
      </ul>
      ${fact("orange", "Partners in the partnership program get a closed group chat with the company founder, along with a hotline and regular partner meetings.")}

      <h2>Hands-on tasks</h2>
      ${tasks("m14", [
        "Look at one dealer invoice in 1C and find the prefix and discount.",
        "Read the dealer section of our Terms of Sale.",
        "Role-play a dealer asking to ship before paying, and answer by the rules."
      ])}

      <h2>Quiz</h2>
      ${quiz([
        { q: "Where does dealer pricing come from?", o: ["The website price", "The discount set for the account, applied on the invoice", "Whatever the dealer asks", "The installer"], a: 1, why: "Dealer pricing is applied after the fact, never worked out from the website." },
        { q: "A product is on promo. Does a dealer get their discount on top?", o: ["Yes", "No", "Only on exterior", "Only in zone A"], a: 0, why: "A dealer discount applies on top of the promo price." },
        { q: "What must a dealer use in their advertising?", o: ["Their own model names", "The United Porte name and our model names", "No names", "Factory names"], a: 1, why: "Dealers must advertise under the United Porte trademark with our model names." },
        { q: "A dealer with unpaid invoices wants an order released. Who decides?", o: ["You", "Inti or Vlad", "The driver", "The warehouse"], a: 1, why: "Releasing held orders needs Inti's or Vlad's approval." },
        { q: "What does a new dealer need to open an account?", o: ["Just an email", "The application form and signed Terms and Conditions", "A website", "A showroom"], a: 1, why: "Application form plus signed T&C." },
        { q: "What is the smallest partnership store format?", o: ["Classic", "Exclusive", "Mini", "Micro"], a: 2, why: "Mini: 377 to 538 sq ft, from $50,000." }
      ])}
      ${completeBox("m14")}${pager("m14")}`;
  };


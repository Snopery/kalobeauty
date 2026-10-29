/* ======================================================================
   KALOBEAUTY  -  THIS IS THE ONLY FILE YOU NEED TO EDIT.

   HOW IT WORKS
   - Each CATEGORY: line starts a new category button.
   - Each SERVICE: line (below a category) is a tile in that category.
   - Services appear in the order written. Cut and paste to reorder or
     move a service to another category. Delete its lines to remove it.
   - A blank line between services is a good idea but not required.
   - Lines starting with # are notes to yourself and are ignored.

   RULES
   - Keep the words before each colon exactly as shown (Price:, Time: ...).
   - Do not use the backtick character ` anywhere in this file.
   - Keep the line with the backtick at the very top and bottom as they are.

   FIELDS FOR A SERVICE
   SERVICE:         name shown under the tile (required)
   Full name:       longer name shown in the big preview (optional)
   Price:           e.g. A$190 (required)
   Time:            e.g. 2 hours (required)
   Booking number:  the number in the Acuity link for this service (required)
                    .../appointment/51297509/calendar/... -> 51297509
   Photo:           file name from the images folder, e.g. volume.jpg (optional)
   Icon:            drawing used when there is no photo (optional). One of:
                    lash, refill, removal, tint, liftext, liftbrow,
                    browwax, lipwax, chinwax, sidewax
   Badge:           small label on the preview, e.g. Most popular (optional)
   Description:     text shown in the preview (optional)

   GALLERY (the photo strip): see the GALLERY section near the bottom.
   Put the photo files in images/gallery/ and add one Photo: line each.
   ====================================================================== */

window.KALO_CONTENT = `

# ---------------- SETTINGS ----------------
Booking link: https://kalobeauty.as.me/schedule/e03f0241/category/X19hbGxfXw%3D%3D
Instagram link: https://www.instagram.com/kalobeauty_/
Calendar number: 7815696


# ======================================================
CATEGORY: Lashes
Note: Refills depend on lash growth.

SERVICE: Glam wispy
Price: A$190
Time: 2 hours
Booking number: 51297509
Photo: glam-wispy.jpg
Badge: Most popular
Description: A balance of dramatic impact and glam volume, for a beautifully defined look.

SERVICE: Light wispy
Price: A$170
Time: 2 hours
Booking number: 51297404
Photo: light-wispy.jpg
Description: A subtle enhancement that gives your natural lashes a soft, dreamy finish. Elegant and effortless.

SERVICE: Volume
Price: A$170
Time: 2 hours
Booking number: 40463467
Photo: volume.jpg
Description: A uniform finish of extensions. Request a natural, medium or glam volume finish.

SERVICE: 60 min refill
Full name: 60 minute lash refill
Price: A$110
Time: 1 hour
Booking number: 52879076
Icon: refill
Description: Suitable if you have about 2 weeks of lash growth.

SERVICE: 75 min refill
Full name: 75 minute lash refill
Price: A$120
Time: 1 hour 15 minutes
Booking number: 52879258
Icon: refill
Description: Suitable if you have about 2.5 weeks of lash growth.

SERVICE: 90 min refill
Full name: 90 minute lash refill
Price: A$130
Time: 1 hour 30 minutes
Booking number: 40918257
Icon: refill
Description: Suitable if you have about 3 weeks of lash growth.

SERVICE: Foreign refill
Price: A$130
Time: 1 hour 30 minutes
Booking number: 94051998
Icon: refill
Description: For lash extensions applied at another salon. We assess your current set first, then refill it for a balanced result.

SERVICE: Removal
Full name: Extension removal
Price: A$30
Time: 35 minutes
Booking number: 40918287
Icon: removal
Description: Taking a break from extensions? We remove them so your natural lashes are freshened up.

# ======================================================
CATEGORY: Lifts
Note: A lift lasts 6 to 8 weeks.

SERVICE: Lash lift + tint
Full name: Korean lash lift and tint
Price: A$130
Time: 1 hour 15 minutes
Booking number: 94313022
Photo: korean-lift.jpg
Description: Lifts and enhances your natural lashes with a glossy, low-maintenance finish. Lasts about 6 to 8 weeks, which is the natural lash cycle.

SERVICE: Lift + extensions
Full name: Korean lash lift and extensions
Price: A$170
Time: 3 hours
Booking number: 95268319
Icon: liftext
Badge: Signature
Description: Our signature combination. A nourishing Korean lash lift, then custom extensions for added fullness and length. The balance of natural and glamorous.

SERVICE: Lash tint
Full name: Eyelash tint only
Price: A$30
Time: 20 minutes
Booking number: 77654176
Icon: tint
Description: Long-lasting colour for a defined, mascara-free look.

# ======================================================
CATEGORY: Brows
Note: Brow services include mapping and sculpting.

SERVICE: Wax + dye
Full name: Eyebrow sculpt wax and hybrid dye
Price: A$60
Time: 50 minutes
Booking number: 86957063
Photo: wax-dye.jpg
Description: Hybrid dye gives a deeper, more defined brow. It lasts up to 2 weeks on the skin and about 6 weeks on the hair.

SERVICE: Dye only
Full name: Hybrid dye only
Price: A$50
Time: 35 minutes
Booking number: 86957037
Photo: dye.jpg
Description: Hybrid dye tints both the skin and the hair. Results last up to 2 weeks on the skin and about 6 weeks on the hair.

SERVICE: Brow wax
Full name: Eyebrow wax only
Price: A$35
Time: 35 minutes
Booking number: 55862425
Icon: browwax
Description: Strip or hard wax, depending on the client. Further wax add-ons are available.

SERVICE: Lip wax
Price: A$10
Time: 10 minutes
Booking number: 77655042
Icon: lipwax
Description: A quick add-on service. Book online to choose a time that suits you.

SERVICE: Chin wax
Price: A$10
Time: 10 minutes
Booking number: 86957317
Icon: chinwax
Description: A quick add-on service. Book online to choose a time that suits you.

SERVICE: Sideburn wax
Price: A$15
Time: 15 minutes
Booking number: 86957336
Icon: sidewax
Description: A quick add-on service. Book online to choose a time that suits you.

# ======================================================
CATEGORY: New clients
Note: Bundles are for first-time clients.

SERVICE: Lashes + brows
Full name: Any lash extension set with eyebrow sculpt, wax and dye
Price: A$210
Time: 2 hours 45 minutes
Booking number: 95163328
Photo: bundle-lash.jpg
Badge: New clients only
Description: Our luxury lash extension set paired with the signature eyebrow sculpt and dye, tailored to your natural features.

SERVICE: Lift + brows
Full name: Korean lash lift and tint with eyebrow sculpt, wax and dye
Price: A$150
Time: 1 hour 55 minutes
Booking number: 95163439
Icon: liftbrow
Badge: New clients only
Description: The signature Korean lash lift and tint, completed with a luxury eyebrow sculpt, wax and dye.

# ======================================================
# GALLERY (the slide-out side panel)
# Put photo files in the images/gallery/ folder.
# Each Photo: line adds one photo, in this order. Caption: is optional
# and applies to the Photo: line above it. Delete a Photo: line to remove it.
# Delete the whole GALLERY section to hide the strip.
GALLERY

Photo: gallery-01.jpg
Photo: gallery-02.jpg
Photo: gallery-04.jpg
Photo: gallery-05.jpg
Photo: gallery-06.jpg
Photo: gallery-07.jpg

# ======================================================
# TRAINING & EDUCATION (the "Education" card near the bottom)
# Fill in the [square bracket] parts with your real details.
# Each COURSE: starts a new tab. Delete a course's lines to remove it.
# Delete the whole TRAINING section to hide it (and its menu button).
# Photo: is a file from images/gallery/. Enquiry link: is where the button goes.
TRAINING
Title: Train with KALOBEAUTY
Intro: [One or two sentences about your training and who it is for.]
Enquiry link: https://www.instagram.com/kalobeauty_/
Button: Enquire now
Photo: gallery-05.jpg

COURSE: Lash extensions
Duration: [e.g. 2 days]
Class size: [e.g. Max 4 students]
Price: [A$ price]
Includes: [Professional kit] | [Hands-on practice on models] | [Printed manual] | [Ongoing support]
Description: [Short summary of what students learn in this course.]

COURSE: Lash lift
Duration: [e.g. 1 day]
Class size: [e.g. Max 4 students]
Price: [A$ price]
Includes: [Professional kit] | [Hands-on practice on models] | [Printed manual] | [Ongoing support]
Description: [Short summary of what students learn in this course.]

COURSE: Brow sculpt
Duration: [e.g. 1 day]
Class size: [e.g. Max 4 students]
Price: [A$ price]
Includes: [Professional kit] | [Hands-on practice on models] | [Printed manual] | [Ongoing support]
Description: [Short summary of what students learn in this course.]

# ======================================================
# REFILL GUIDE (the 'Which refill do you need?' section)
# Delete everything from the REFILL GUIDE line down to hide it.
# 'Service:' must match a SERVICE: name above exactly.
REFILL GUIDE
Title: Which lash refill do you need?
Question: How much growth since your last set?

OPTION: About 2 weeks
Service: 60 min refill
Note: For about 2 weeks of lash growth.

OPTION: About 2.5 weeks
Service: 75 min refill
Note: For about 2.5 weeks of lash growth.

OPTION: About 3 weeks
Service: 90 min refill
Note: For about 3 weeks of lash growth.

OPTION: Another salon
Service: Foreign refill
Note: We assess your current set and refill it for a seamless, balanced result.

`;

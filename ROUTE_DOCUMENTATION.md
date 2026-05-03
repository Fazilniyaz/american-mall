# Route Documentation — American Mall Sales Deck

This document outlines the complete route structure of the American Mall interactive sales deck. For each route, we define the deep storytelling concept that drives the user experience, along with the technologies used, responsiveness, and Lighthouse performance scores.

> **Note on AI Assets:** AI-generated assets should be manually entered and tracked by the content manager where real-world media was unavailable.

---

## 00. The Pre-Deck Sequence (Entry)

### Route: `/`
- **Storytelling Concept:** **The Grand Entrance.** Before the presentation even begins, we set a premium, cinematic tone. It acts as the lobby of a luxury hotel—creating a moment of anticipation. It immerses the viewer immediately, establishing the Mall of America as a global destination before a single fact is presented.
- **Technologies:** Next.js, React, Google Flow
- **Responsive:** ✅
- **Lighthouse:** *(Root domain score, typically 99/100)*
- **AI Assets:** AI-generated video in the background for the entrance section with voice-over. For mobiles, this is replaced with an AI-generated image.

---

## 01. Introduction & Scale

### Route: `/intro`
- **Storytelling Concept:** **The Cinematic Hook.** We don't start with facts; we start with a feeling. The goal here is immediate emotional buy-in. Using a high-end, immersive background, we establish that this isn't just a mall—it's a destination. The user should feel the prestige, scale, and energy of "America's Most Iconic Mall" within the first 3 seconds. It sets the tone of a luxury brand pitch.
- **Technologies:** Next.js, Three.js (Particles), GSAP, Google Flow, Meta AI, Hugging face for AI Video and Image Generation.
- **Responsive:** ✅
- **Lighthouse (Mobile):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-intro/a7peefexr7?form_factor=mobile)
-- **AI Assets:** : Real video was used in background (B Roll of Mall of America)

### Route: `/introTwo`
- **Storytelling Concept:** **The Proof of Dominance.** Transitioning from pure emotion to hard data. By animating massive numbers (40M visitors, 520+ stores, 5.6M sqft), we ground the initial awe in undeniable business reality. The viewer instantly realizes the sheer gravity and market dominance of the property.
- **Technologies:** Next.js, D3.js (Arc Counters)
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-introTwo/rntdvo7965?form_factor=desktop)
- **AI Assets:** : null. just shown the stats with Animation. 

---

## 02. Who's Here (Social Proof)

### Route: `/WhosHereSection`
- **Storytelling Concept:** **The Halo Effect.** Brands want to be next to other great brands. This route provides immediate social proof by showcasing a massive, infinitely scrolling ticker of global leaders who have already invested here. It implicitly asks the prospect: "Your competitors are here. Why aren't you?"
- **Technologies:** Next.js, GSAP, D3.js
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-WhosHereSection/nzlkwzgym3?form_factor=desktop)
- **AI Assets:** : AI Generated Background Video Showcasing the Brand Stores Already in the Mall of America.

### Route: `/WhosHereOne`
- **Storytelling Concept:** **The Flagship Standard.** We zoom in on the biggest players (Apple, Nike, Zara). This tells the story that this property is reserved for flagship-level experiences, not standard inline stores. It elevates the prospect's ambition, pushing them to think bigger about their potential footprint.
- **Technologies:** Next.js, CSS Transitions, Google Flow for Video Generation.
- **Responsive:** ✅
- **Lighthouse (Mobile):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-WhosHereOne/uaj0gwb5bh?form_factor=mobile)
- **AI Assets:** : Ai Generated images to showcases the stores of each brands.


### Route: `/WhosHereTwo`
- **Storytelling Concept:** **The Ecosystem of Scale.** Expanding the view to show the sheer volume of retail partners. It tells the story of a thriving, massive commercial ecosystem where every retail category is represented, supported, and highly profitable.
- **Technologies:** Next.js, GSAP, HuggingFace for Image Generation.
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-WhosHereTwo/38dy5bozqq?form_factor=desktop)
- **AI Assets:** : null

---

## 03. Explore

### Route: `/explore`
- **Storytelling Concept:** **The Invitation to Discover.** A cinematic breath between sections. This title card gracefully shifts the narrative from "who we are" to "where you could be," preparing the viewer to understand the physical space.
- **Technologies:** Next.js, CSS Transitions
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-explore/2lm0s74wx1?form_factor=desktop)
- **AI Assets:** : AI generated background image using HuggingFace.

### Route: `/explore/MallMap`
- **Storytelling Concept:** **The Blueprint of Opportunity.** By visualizing the 5.6M sqft space in an interactive 3D floor stack, we demystify the massive scale and make it navigable. It shows that despite its size, the space is meticulously planned for optimal traffic flow and brand visibility.
- **Technologies:** Next.js, Three.js, D3.js
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-explore-MallMap/wdilpfc1dt?form_factor=desktop)
- **AI Assets:** : null

### Route: `/explore/whereYourBrandLives`
- **Storytelling Concept:** **The Strategic Placement.** This isn't just about finding an empty unit; it's about strategic positioning. We tell the story of premium zones and high-traffic pathways, showing the prospect exactly how their specific brand can capture the 40M visitors.
- **Technologies:** Next.js, D3.js
- **Responsive:** ✅
- **Lighthouse (Mobile):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-explore-whereYourBrandLives/s0gzb0c7tf?form_factor=mobile)
- **AI Assets:** : null

---

## 04. Entertainment

### Route: `/Entertainment`
- **Storytelling Concept:** **Beyond Retail.** We pivot the story. People don't just come to shop; they come for the experience. This introduces the concept that world-class entertainment is the true anchor driving our unparalleled, year-round foot traffic.
- **Technologies:** Next.js, CSS Animations
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-Entertainment/0bebypawj0?form_factor=desktop)
- **AI Assets:** : null. Real Video is used.

### Route: `/Entertainment/themePark`
- **Storytelling Concept:** **The Ultimate Anchor.** Highlighting Nickelodeon Universe (the largest indoor theme park) proves that this property offers experiences impossible to replicate in standard retail environments, ensuring all-day family dwell time and immense weekend traffic.
- **Technologies:** Next.js, next/image, CSS
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-Entertainment-themePark/ico6yy6d34?form_factor=desktop)
- **AI Assets:** : null. Real Image is used.


### Route: `/Entertainment/Aquarium`
- **Storytelling Concept:** **The Immersive Draw.** Showcasing SEA LIFE Aquarium reinforces the destination aspect. It tells the story of diverse, ticketed attractions that turn a simple shopping trip into a multi-day vacation.
- **Technologies:** Next.js, next/image, CSS
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-Entertainment-Aquarium/jecfzh6v1x?form_factor=desktop)
- **AI Assets:** : null. Real Image is used.


### Route: `/Entertainment/Dining`
- **Storytelling Concept:** **The Culinary Destination.** Food is no longer an afterthought; it's a primary driver. We highlight the $380M F&B revenue to prove that premium dining experiences keep visitors engaged, happy, and spending longer on the property.
- **Technologies:** Next.js, GSAP
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-Entertainment-Dining/93k6hdamcg?form_factor=desktop)
- **AI Assets:** : AI Generated Background video using Google Flow was used

### Route: `/Entertainment/Shopping`
- **Storytelling Concept:** **The Core Engine.** Tying the entertainment back to commerce. The story here is that the massive footfall generated by the attractions inevitably flows into the retail corridors, driving unparalleled sales density for our tenants.
- **Technologies:** Next.js, next/image, CSS
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-Entertainment-Shopping/wozj5zorwf?form_factor=desktop)
- **AI Assets:** : Ai Generated Image using HuggingFace was used.

---

## 05. Events & Activations

### Route: `/events`
- **Storytelling Concept:** **The Global Stage.** We re-contextualize the mall from a shopping center to a global event platform. It tells promoters and brands that this is the place to launch something big, surrounded by a captive audience.
- **Technologies:** Next.js, next/image
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-events/0e8sw7j0t8?form_factor=desktop)
- **AI Assets:** : null. Real Image is used.

### Route: `/events/stats`
- **Storytelling Concept:** **The ROI of Attention.** Backing up the "Global Stage" claim with hard data. We show the attendance records and revenue generated by events, proving that activating here yields massive, measurable return on investment.
- **Technologies:** Next.js, CSS Transitions
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-events-stats/vr2lkbf97y?form_factor=desktop)
- **AI Assets:** : null. No Images or videos are used in this route.

### Route: `/events/tech`
- **Storytelling Concept:** **The Innovation Hub.** Focusing on tech events positions the property as forward-thinking. It tells tech brands that their cutting-edge products belong here, surrounded by a tech-savvy, high-intent audience.
- **Technologies:** Next.js, CSS Animations
- **Responsive:** ✅
- **Lighthouse (Mobile):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-events-tech/wijae1c70h?form_factor=mobile)
- **AI Assets:** : AI generated images using Google Flow were used.

### Route: `/events/tech/appleVisionPro`
- **Storytelling Concept:** **The Ultimate Proof of Concept.** Apple is notoriously selective. By showcasing a successful Vision Pro demo event, we tell every other brand: "If it's good enough for Apple's most crucial product launch, it's the right place for yours."
- **Technologies:** Next.js, next/image, CSS
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-events-tech-appleVisionPro/026881epjb?form_factor=desktop)
- **AI Assets:** : null. Real Images are used.

### Route: `/events/tech/samsungGrandStoreOpening`
- **Storytelling Concept:** **The Blockbuster Launch.** Showcasing the scale of the Samsung opening proves our capability to handle massive crowds, celebrity appearances, and global media attention for flagship brand launches.
- **Technologies:** Next.js, GSAP
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-events-tech-samsungGrandStoreOpening/nacexjk2b9?form_factor=desktop)
- **AI Assets:** : null. Real Video was used.

### Route: `/events/tech/vrAndGamingZones`
- **Storytelling Concept:** **The Next Generation.** Highlighting esports and permanent VR installations shows that the property actively captures the elusive Gen Z and Alpha demographics, future-proofing the audience for our partners.
- **Technologies:** Next.js, GSAP 
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-events-tech-vrAndGamingZones/fntvx0v2k4?form_factor=desktop)
- **AI Assets:** : AI generated images using Google Flow were used.

### Route: `/events/entertainmentAndGaming`
- **Storytelling Concept:** **The Pop-Culture Epicenter.** This overview tells the story of how the property intersects with music, sports, and gaming, becoming a cultural touchstone rather than just a commercial space.
- **Technologies:** Next.js, next/image, CSS
- **Responsive:** ✅
- **Lighthouse (Mobile):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-events-entertainmentAndGaming/3b4bjgrnf8?form_factor=mobile)
- **AI Assets:** : AI generated images using Google Flow were used.


### Route: `/events/entertainmentAndGaming/nikeSneakerLaunchEvent`
- **Storytelling Concept:** **The Hype Machine.** Demonstrating the capacity for exclusive sneaker drops proves that the property can handle high-demand, queue-heavy events safely while generating massive organic social buzz.
- **Technologies:** Next.js, GSAP
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-events-entertainmentAndGaming-nikeSneakerLaunchEvent/o6qajx718s?form_factor=desktop)
- **AI Assets:** : AI generated video using google flow was used.

### Route: `/events/entertainmentAndGaming/adidasFanEngagementEvent`
- **Storytelling Concept:** **The Interactive Connection.** Showcasing experiential fan engagement tells brands they can do more than sell products here; they can build deep, interactive, physical relationships with their consumers.
- **Technologies:** Next.js, GSAP
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-events-entertainmentAndGaming-adidasFanEngagementEvent/kisx0mmcri?form_factor=desktop)
- **AI Assets:** : AI generated video using google flow was used.

### Route: `/events/entertainmentAndGaming/xboxGamingEvents`
- **Storytelling Concept:** **The Convention Scale.** By highlighting a massive Xbox preview event, we prove the property's capability to act as a full-scale convention center, accommodating thousands of highly engaged attendees.
- **Technologies:** Next.js, GSAP, Three.js
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-events-entertainmentAndGaming-xboxGamingEvents/wwxwagwxom?form_factor=desktop)
- **AI Assets:** : null. Real images are used.

---

## 06. The Revenue Bridge

### Route: `/footfall-revenue`
- **Storytelling Concept:** **The Conversion Narrative (The Core Pitch).** This is the crucial bridge of the deck. It connects the 40M visitors directly to the bottom line. The story is simple and undeniable: massive traffic + high dwell time = unmatched brand revenue and ROI.
- **Technologies:** Next.js, D3.js
- **Responsive:** ✅
- **Lighthouse (Mobile):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-footfall-revenue/i3obmya3ek?form_factor=mobile)
- **AI Assets:** : null. No Images or videos are used.

---

## 07. Take Action (The Close)

### Route: `/takeAction/Partnership`
- **Storytelling Concept:** **The Strategic Alliance.** Moving from the pitch to the close. We tell brands that we don't just want sponsors; we want true partners. We offer holistic media, experiential, and digital integrations tailored to their goals.
- **Technologies:** Next.js, next/image, CSS
- **Responsive:** ✅
- **Lighthouse (Mobile):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-takeAction-Partnership/3uy8f8uh5l?form_factor=mobile)
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-takeAction-Partnership/w16228me4f?form_factor=desktop)
- **AI Assets:** : AI generated Image using google flow was used.

### Route: `/takeAction/LeaseASpace`
- **Storytelling Concept:** **The Foundation of Presence.** A direct, concrete call to action for retail tenants. The story shifts from aspirational to practical—showing available footprints, sizes, and making it easy to start the leasing conversation.
- **Technologies:** Next.js, GSAP
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-takeAction-LeaseASpace/3jux3bncyh?form_factor=desktop)
- **AI Assets:** : AI generated Image using google flow was used.


### Route: `/takeAction/BecomeASponsor`
- **Storytelling Concept:** **The Value Hierarchy.** Presenting clear, premium sponsorship tiers. The story here is exclusivity and targeted reach. We make it easy for brands to understand exactly what level of investment buys what level of access to our 40M audience.
- **Technologies:** Next.js, next/image, CSS
- **Responsive:** ✅
- **Lighthouse:** *(Recently Optimized)*
- **AI Assets:** : AI generated Image using google flow was used.


### Route: `/takeAction/HostAnEvent`
- **Storytelling Concept:** **The Canvas Awaits.** We provide the venues, specs, and capacities. The story is an invitation to promoters and agencies: "Bring your biggest ideas; we have the premium space, infrastructure, and built-in audience to make them legendary."
- **Technologies:** Next.js, next/image, CSS
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-takeAction-HostAnEvent/hgufqg1vmt?form_factor=desktop)
    - **AI Assets:** : AI generated Image using google flow was used.


### Route: `/takeAction/FinalActions`
- **Storytelling Concept:** **The Inevitable Conclusion.** The ultimate closing slide of the pitch. No more selling—just clear, frictionless pathways to conversion. The story ends by empowering the user to take the exact next step they need, immediately.
- **Technologies:** Next.js, GSAP
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-events-tech-vrAndGamingZones/fntvx0v2k4?form_factor=desktop)
- **AI Assets:** : null. No Images or videos used.

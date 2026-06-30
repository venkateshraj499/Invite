// Photo manifest — plain JS (not fetched JSON) so the site also works when opened
// directly via file:// without a local server. Edit this file to add next week's photos.
window.PHOTOS = {
  hero: { file: "hero.jpg", alt: "Brindha glancing back over her shoulder, Venkatesh beside her" },
  // reception/muhurtham/fewWords were swapped from engagement photos to the pre-wedding
  // shoot (temple/indoor/outdoor) so the page doesn't lean so heavily on one shoot's look.
  itinerary: {
    reception: { file: "itinerary-reception.jpg", alt: "Venkatesh and Brindha at the temple, pink and gold attire" },
    muhurtham: { file: "itinerary-muhurtham.jpg", alt: "Venkatesh and Brindha together on a traditional swing" }
  },
  fewWords: { file: "fewwords.jpg", alt: "Venkatesh and Brindha dancing together on the beach" },
  close: { file: "close.jpg", alt: "Henna-painted hands reading V and B" },
  // span is chosen to match each photo's real orientation (landscape source -> wide/square,
  // portrait source -> tall/square) so object-fit:cover never has to crop a 90°-mismatched box.
  // focal sets object-position so faces stay in frame within whatever crop remains.
  gallery: [
    { file: "gallery-01.jpg", alt: "Candid moment, hands clasped, floral arch backdrop", span: "wide", focal: "50% 45%" },
    { file: "gallery-02.jpg", alt: "Confident formal portrait under a ballroom chandelier", span: "tall", focal: "50% 22%" },
    { file: "gallery-04.jpg", alt: "Couple in silhouette, backlit circular frame", span: "square", focal: "50% 50%" },
    { file: "gallery-05.jpg", alt: "Macro of engagement rings on henna-painted hand", span: "square", focal: "35% 50%" },
    { file: "gallery-07.jpg", alt: "Eyes-closed embrace", span: "tall", focal: "50% 25%" },
    { file: "gallery-11.jpg", alt: "Macro of henna palms raised, serene expression", span: "square", focal: "50% 40%" },
    { file: "gallery-12.jpg", alt: "Wide couple portrait, floral double-ring arch", span: "wide", focal: "50% 35%" }
  ],
  reserved: [
    { file: "gallery-03.jpg", note: "playful candid — trimmed when gallery was tightened to 7" },
    { file: "gallery-06.jpg", note: "wide formal portrait — trimmed when gallery was tightened to 7" },
    { file: "gallery-08.jpg", note: "side-by-side formal — trimmed when gallery was tightened to 7" },
    { file: "gallery-09.jpg", note: "groom solo — now redundant with the dedicated Bride & Groom section" },
    { file: "gallery-10.jpg", note: "bride solo — now redundant with the dedicated Bride & Groom section" },
    { file: "DS_00757-Recovered.jpg", note: "near-duplicate of hero — swap candidate for next batch" },
    { file: "DS_00763 copy.jpg", note: "near-duplicate of hero — swap candidate for next batch" }
  ]
};

// Photo manifest — plain JS (not fetched JSON) so the site also works when opened
// directly via file:// without a local server. Edit this file to add next week's photos.
window.PHOTOS = {
  hero: { file: "hero.jpg", alt: "Brindha glancing back over her shoulder, Venkatesh beside her" },
  // reception/muhurtham/fewWords were swapped from engagement photos to the pre-wedding
  // shoot (temple/indoor/outdoor) so the page doesn't lean so heavily on one shoot's look.
  itinerary: {
    reception: { file: "itinerary-reception.jpg", alt: "Venkatesh and Brindha leaning against a tree in the forest, matching red outfits" },
    muhurtham: { file: "itinerary-muhurtham.jpg", alt: "Venkatesh and Brindha at the temple, traditional pink and gold attire" }
  },
  fewWords: { file: "fewwords.jpg", alt: "Venkatesh and Brindha dancing together on the beach" },
  close: { file: "close.jpg", alt: "Henna-painted hands reading V and B" },
  // span is chosen to match each photo's real orientation (landscape source -> wide/square,
  // portrait source -> tall/square) so object-fit:cover never has to crop a 90°-mismatched box.
  // focal sets object-position so faces stay in frame within whatever crop remains.
  gallery: [
    { file: "gallery-01.jpg", alt: "Ring exchange — groom presenting the ring, bokeh background", span: "wide", focal: "50% 40%" },
    { file: "gallery-07.jpg", alt: "Back-to-back editorial portrait, both in full traditional attire", span: "tall", focal: "50% 10%" },
    { file: "gallery-05.jpg", alt: "Formal engagement portrait, Brindha in full bridal jewellery", span: "square", focal: "50% 12%" },
    { file: "gallery-08.jpg", alt: "Couple seated on gold bench, warm indoor lighting", span: "square", focal: "50% 32%" },
    { file: "gallery-12.jpg", alt: "Couple at the engagement ceremony, floral arch backdrop", span: "wide", focal: "50% 30%" }
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

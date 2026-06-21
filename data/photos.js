// Photo manifest — plain JS (not fetched JSON) so the site also works when opened
// directly via file:// without a local server. Edit this file to add next week's photos.
window.PHOTOS = {
  hero: { file: "hero.jpg", alt: "Brindha glancing back over her shoulder, Venkatesh beside her" },
  itinerary: {
    reception: { file: "itinerary-reception.jpg", alt: "Venkatesh and Brindha in an embrace" },
    muhurtham: { file: "itinerary-muhurtham.jpg", alt: "Venkatesh and Brindha, a quiet affectionate moment" }
  },
  fewWords: { file: "fewwords.jpg", alt: "Venkatesh and Brindha, formal portrait" },
  close: { file: "close.jpg", alt: "Henna-painted hands reading V and B" },
  // span is chosen to match each photo's real orientation (landscape source -> wide/square,
  // portrait source -> tall/square) so object-fit:cover never has to crop a 90°-mismatched box.
  // focal sets object-position so faces stay in frame within whatever crop remains.
  gallery: [
    { file: "gallery-01.jpg", alt: "Candid moment, hands clasped, floral arch backdrop", span: "wide", focal: "50% 45%" },
    { file: "gallery-02.jpg", alt: "Confident formal portrait under a ballroom chandelier", span: "tall", focal: "50% 22%" },
    { file: "gallery-03.jpg", alt: "Playful candid moment", span: "wide", focal: "50% 40%" },
    { file: "gallery-04.jpg", alt: "Couple in silhouette, backlit circular frame", span: "square", focal: "50% 50%" },
    { file: "gallery-05.jpg", alt: "Macro of engagement rings on henna-painted hand", span: "square", focal: "35% 50%" },
    { file: "gallery-06.jpg", alt: "Wide formal portrait on an ornate gold bench", span: "wide", focal: "50% 35%" },
    { file: "gallery-07.jpg", alt: "Eyes-closed embrace", span: "tall", focal: "50% 25%" },
    { file: "gallery-08.jpg", alt: "Side-by-side formal portrait", span: "tall", focal: "50% 15%" },
    { file: "gallery-09.jpg", alt: "Groom solo portrait", span: "square", focal: "50% 22%" },
    { file: "gallery-10.jpg", alt: "Bride solo, contemplative", span: "square", focal: "50% 38%" },
    { file: "gallery-11.jpg", alt: "Macro of henna palms raised, serene expression", span: "square", focal: "50% 40%" },
    { file: "gallery-12.jpg", alt: "Wide couple portrait, floral double-ring arch", span: "wide", focal: "50% 35%" }
  ],
  reserved: [
    { file: "DS_00757-Recovered.jpg", note: "near-duplicate of hero — swap candidate for next batch" },
    { file: "DS_00763 copy.jpg", note: "near-duplicate of hero — swap candidate for next batch" }
  ]
};

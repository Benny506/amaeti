import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllContent } from '../store/contentSlice';
import { showSubtleLoader, hideSubtleLoader, addToast } from '../store/uiSlice';

import HeroCarousel from '../components/home/HeroCarousel';
import ShowcaseSection from '../components/home/ShowcaseSection';
import AtelierSection from '../components/home/AtelierSection';
import FeaturedCollection from '../components/home/FeaturedCollection';
import PhilosophyBanner from '../components/home/PhilosophyBanner';

const defaultHomeContent = {
  hero_carousel: {
    slides: [
      { subtitle: "NEW SEASON COLLECTION", title: "Abstract expression of art & form.", desc: "Designed with architectural silhouettes, muted natural tones, and premium organic fabrics for the contemporary wardrobe.", button_text: "Explore Collection" },
      { subtitle: "THE ATELIER EXCLUSIVE", title: "A curation of sculptural silhouettes.", desc: "Each piece is an envelope of form, natural fabric, and sculptured silhouette built from organic symmetry.", button_text: "Explore Collection" },
      { subtitle: "ORGANIC SYMMETRY", title: "Wearable canvases for the modern muse.", desc: "Embracing the intersection of minimalist design and high-fashion architecture.", button_text: "Explore Collection" }
    ]
  },
  atelier_section: {
    subtitle: "THE ATELIER PHILOSOPHY",
    quote: "\"Fashion is wearable abstract expressionism.\"",
    body: "At amaeti, our design language is defined by the intersection of fine craftsmanship and organic geometry. Drawing inspiration from contemporary sculpture and natural textures, we forge garments that sit harmoniously on the human form while asserting a bold, architectural voice.",
    button_1_text: "Our Story",
    button_2_text: "Shop Atelier"
  },
  showcase_section: {
    title: "The Potential Archive",
    subtitle: "A glimpse into the future of the Amaeti collection. Designed for the modern sophisticate.",
    items: [
      { name: "The Structured Trench", price: "$1,250", type: "video" },
      { name: "Pleated Silk Blouse", price: "$680", type: "image" },
      { name: "Cashmere Overcoat", price: "$2,100", type: "video" },
      { name: "Tailored Wide-Leg Trouser", price: "$850", type: "image" },
      { name: "Evening Plunge Gown", price: "$3,400", type: "video" },
      { name: "Minimalist Leather Tote", price: "$1,800", type: "image" },
      { name: "Sculptural Knit Dress", price: "$1,150", type: "image" },
      { name: "Oversized Blazer", price: "$1,400", type: "image" }
    ]
  },
  featured_collection: {
    slides: [
      { left: { title: "Linen & Canvas", type: "image" }, right: { title: "Atelier Silks", type: "video" } },
      { left: { title: "Knitwear", type: "video" }, right: { title: "Outerwear", type: "image" } },
      { left: { title: "Handbags", type: "image" }, right: { title: "Footwear", type: "image" } },
      { left: { title: "Accessories", type: "image" }, right: { title: "Swimwear", type: "video" } },
      { left: { title: "Tailoring", type: "image" }, right: { title: "Eveningwear", type: "image" } }
    ]
  },
  philosophy_banner: {
    title: "Abstract Expressionism in Design",
    quote: "\"We do not create mere garments. We create canvases. We create frames. Sculpted from earth-friendly elements, finished with wood-toned warmth, designed to frame your individuality.\"",
    button_text: "Discover The Collection"
  }
};

const Home = () => {
  const dispatch = useDispatch();
  const { pages, loading, error } = useSelector((state) => state.content);
  
  useEffect(() => {
    // Fetch if we haven't loaded any pages yet
    if (Object.keys(pages).length === 0 && !loading.global) {
      dispatch(showSubtleLoader('Fetching latest collection...'));
      dispatch(fetchAllContent())
        .unwrap()
        .then(() => {
          dispatch(hideSubtleLoader());
        })
        .catch((err) => {
          dispatch(hideSubtleLoader());
          dispatch(addToast({ type: 'error', message: 'Failed to load live content. Using defaults.' }));
        });
    }
  }, [dispatch, pages, loading.global]);

  const content = pages.home || defaultHomeContent;

  return (
    <main>
      <HeroCarousel content={content.hero_carousel} />
      <AtelierSection content={content.atelier_section} />
      <ShowcaseSection content={content.showcase_section} />
      <FeaturedCollection content={content.featured_collection} />
      <PhilosophyBanner content={content.philosophy_banner} />
    </main>
  );
};

export default Home;


import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Set the document title
document.title = "wedspace - Wedding Planning Platform";

// Add meta description for SEO
const metaDescription = document.createElement('meta');
metaDescription.name = 'description';
metaDescription.content = 'Find the best wedding venues and vendors. Plan your perfect wedding with wedspace - your trusted wedding planning platform.';
document.head.appendChild(metaDescription);

// Add meta keywords for SEO
const metaKeywords = document.createElement('meta');
metaKeywords.name = 'keywords';
metaKeywords.content = 'wedding venues, wedding planners, wedding vendors, wedding planning, dream wedding';
document.head.appendChild(metaKeywords);

createRoot(document.getElementById("root")!).render(<App />);

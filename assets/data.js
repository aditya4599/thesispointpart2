/* ThesisPoint Research — site data.
 *
 * While apiBase is empty, the site shows the research listed below.
 * Once TPR Back-End is live, set apiBase to its address, e.g.
 *   apiBase: 'https://admin.thesispointresearch.com'
 * and the site will load published research from it and save newsletter signups there.
 */
window.TPR_CONFIG = {
  apiBase: '',
};

/* Same field names as TPR Back-End's /api/reports, so switching over needs no other change.
   `link` is where "Read" goes; it points to the current site's report pages for now. */
window.TPR_SAMPLE = [
  {
    slug: 'rocket-lab-space-growth',
    type: 'stock_report',
    title: 'Rocket Lab: Neutron makes it the credible challenger to SpaceX',
    company: 'Rocket Lab',
    ticker: 'RKLB',
    exchange: 'NASDAQ',
    market: 'US',
    sector: 'Aerospace & defence',
    rating: 'Buy',
    reco_status: 'open',
    currency: 'USD',
    price_at_publication: 70.02,
    target_price: 110,
    upside_pct: 57.1,
    summary: 'If Neutron flies, Rocket Lab becomes the most credible challenger to Falcon 9, and the Iridium deal would bring launch demand in-house.',
    published_at: '2026-09-23',
    author: 'Ruhaan Bajaj',
    link: 'https://www.thesispointresearch.com/research/stock-reports/rocket-lab-space-growth',
  },
  {
    slug: 'meta-platforms-ai-spending-capex',
    type: 'stock_report',
    title: 'Meta Platforms: the AI capex panic is overdone',
    company: 'Meta Platforms',
    ticker: 'META',
    exchange: 'NASDAQ',
    market: 'US',
    sector: 'Technology',
    rating: 'Buy',
    reco_status: 'target_met',
    currency: 'USD',
    price_at_publication: 544.2,
    target_price: 745,
    upside_pct: 36.9,
    summary: 'The market priced AI capex as waste. We argued ad pricing power and new AI revenue would pay for it.',
    published_at: '2026-08-19',
    author: 'Ruhaan Bajaj',
    link: 'https://www.thesispointresearch.com/research/stock-reports/meta-platforms-ai-spending-capex',
  },
  {
    slug: 'adobe-ai-growth-stock-report',
    type: 'stock_report',
    title: 'Adobe: the AI selloff overshot',
    company: 'Adobe',
    ticker: 'ADBE',
    exchange: 'NASDAQ',
    market: 'US',
    sector: 'Technology',
    rating: 'Buy',
    reco_status: 'open',
    currency: 'USD',
    price_at_publication: 238.02,
    target_price: 298,
    upside_pct: 25.2,
    summary: 'The AI selloff overshot. Creative Cloud retention and Firefly monetisation support upside from here.',
    published_at: '2026-05-25',
    author: 'Ruhaan Bajaj',
    link: 'https://www.thesispointresearch.com/research/stock-reports/adobe-ai-growth-stock-report',
  },
  {
    slug: 'india-nuclear-energy-imperative',
    type: 'article',
    title: 'The nuclear imperative: why India cannot ignore atomic energy',
    market: 'India',
    sector: 'Energy',
    summary: 'India’s clean-energy transition may lean on nuclear power more than investors expect, as the base load behind energy security and industrial growth.',
    read_minutes: 10,
    published_at: '2026-05-25',
    author: 'ThesisPoint Research',
    link: 'https://www.thesispointresearch.com/research/articles/india-nuclear-energy-imperative',
  },
  {
    slug: 'why-oil-prices-matter-global-markets',
    type: 'article',
    title: 'Why oil prices matter more than you think',
    market: 'Global',
    sector: 'Energy',
    summary: 'Crude feeds into inflation, currencies, central-bank decisions and equity valuations well beyond the energy sector.',
    read_minutes: 5,
    published_at: '2026-05-25',
    author: 'ThesisPoint Research',
    link: 'https://www.thesispointresearch.com/research/articles/why-oil-prices-matter-global-markets',
  },
];

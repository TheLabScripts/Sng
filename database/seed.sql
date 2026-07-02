INSERT OR IGNORE INTO marketplace_sources (id, name, type, base_url, is_active, config_json, created_at, updated_at) VALUES
('source-mock-marketplace', 'Mock Marketplace', 'mock', '', 1, '{"resultCount":24}', datetime('now'), datetime('now')),
('source-html-fixture', 'Local HTML Snapshot', 'html_snapshot', '/fixtures/snapshots/public-listings.html', 0, '{"selectors":{"item":".listing-card","title":".listing-title","price":".listing-price","url":".listing-link","image":".listing-image","location":".listing-location","description":".listing-description","externalIdAttribute":"data-id"}}', datetime('now'), datetime('now')),
('source-facebook-placeholder', 'Facebook Marketplace Placeholder', 'facebook_placeholder', '', 0, '{"mode":"snapshot","snapshotUrl":"/fixtures/snapshots/facebook-marketplace-sample.html","selectors":{"item":".marketplace-item","title":".title","price":".price","url":".listing-link","image":"img","location":".location","externalIdAttribute":"data-listing-id"}}', datetime('now'), datetime('now'));

INSERT OR IGNORE INTO saved_searches (id, user_id, name, zip_code, radius_miles, category, keywords, negative_keywords, min_price, max_price, min_estimated_profit, min_deal_score, is_active, scan_interval_minutes, created_at, updated_at) VALUES
('search-demo-tools', 'dev-user', 'Tools under $300', '08102', 25, 'Tools', 'Milwaukee, DeWalt, Makita, bundle', 'broken, parts only, missing', 0, 300, 75, 68, 1, 30, datetime('now'), datetime('now')),
('search-demo-vehicles', 'dev-user', 'Local vehicle flips', '08102', 50, 'Vehicles', 'Toyota, Honda, Ford, motorcycle', 'salvage, rebuilt, no title', 500, 12000, 1200, 72, 1, 60, datetime('now'), datetime('now'));

INSERT OR IGNORE INTO saved_search_sources (saved_search_id, source_id, created_at) VALUES
('search-demo-tools', 'source-mock-marketplace', datetime('now')),
('search-demo-vehicles', 'source-mock-marketplace', datetime('now'));

INSERT OR IGNORE INTO listings (id, source_id, source, external_id, source_url, title, description, price, currency, location_text, zip_code, distance_miles, category, image_urls, posted_at, scraped_at, raw_json, content_hash, is_active, created_at, updated_at) VALUES
('listing-seed-high', 'source-mock-marketplace', 'Mock Marketplace', 'seed-high', 'https://example.com/mock-listing/seed-high', 'Milwaukee M18 bundle with batteries', 'Working drill, impact, charger, and batteries.', 120, 'USD', 'Camden, NJ', '08102', 4.2, 'Tools', '["https://picsum.photos/seed/seed-high/720/540"]', datetime('now', '-12 minutes'), datetime('now'), '{"estimatedResalePrice":310}', 'seed-high-content-hash', 1, datetime('now'), datetime('now')),
('listing-seed-low', 'source-mock-marketplace', 'Mock Marketplace', 'seed-low', 'https://example.com/mock-listing/seed-low', 'Broken drill parts only', 'Does not power on and is missing the battery.', 95, 'USD', 'Camden, NJ', '08102', 7.8, 'Tools', '[]', datetime('now', '-2 hours'), datetime('now'), '{"estimatedResalePrice":115}', 'seed-low-content-hash', 1, datetime('now'), datetime('now'));

INSERT OR IGNORE INTO listing_matches (id, listing_id, saved_search_id, user_id, estimated_resale_price, estimated_costs, estimated_profit, deal_score, reason, risk_flags, status, created_at, updated_at) VALUES
('match-seed-high', 'listing-seed-high', 'search-demo-tools', 'dev-user', 310, 18, 172, 91, '$172 estimated profit; score 91/100; no major automated risk flags.', '[]', 'new', datetime('now'), datetime('now')),
('match-seed-low', 'listing-seed-low', 'search-demo-tools', 'dev-user', 115, 29, -9, 18, 'Negative estimated margin; score 18/100; no image, damaged/parts-only keywords.', '["no image","damaged/parts-only keywords"]', 'ignored', datetime('now'), datetime('now'));

INSERT OR IGNORE INTO alerts (id, user_id, listing_match_id, channel, title, body, status, sent_at, created_at) VALUES
('alert-seed-high', 'dev-user', 'match-seed-high', 'in_app', '91 score: Milwaukee M18 bundle', '$172 estimated profit and no major automated risk flags.', 'unread', datetime('now'), datetime('now'));

INSERT OR IGNORE INTO crawler_runs (id, source_id, saved_search_id, status, started_at, finished_at, listings_found, new_listings_found, created_at) VALUES
('run-seed-complete', 'source-mock-marketplace', 'search-demo-tools', 'completed', datetime('now', '-5 minutes'), datetime('now', '-4 minutes'), 12, 2, datetime('now', '-5 minutes'));

-- KÖKEDVES: BRIDE WHO NEVER LEFT
-- Seed Data: Chapters and Two Distinct Correspondence Rooms

-- SEED CHAPTERS
INSERT INTO public.chapters (id, title, slug, chapter_label, subtitle, content, cover_image_url, display_order, status, published_at, created_at, updated_at) VALUES
('c1111111-1111-1111-1111-111111111111',
 'BEFORE MARBLE LEARNED MY NAME',
 'before-marble-learned-my-name',
 'CHAPTER I',
 'Of ordinary mornings, newly shared rooms, and a life not yet interrupted.',
 'There were mornings before the silence grew so heavy that even the grandfather clock seemed ashamed to strike the quarter-hour.

We had shared an apartment on the third floor of Thököly út, where the morning sun struck the parquet flooring at an acute, golden angle. The tea was always steep and bitter; you laughed at how I measured sugar in thirds of a teaspoon, as though precision could safeguard domestic happiness against the sudden tumult of history.

Our bed stood beside the French doors that opened toward the courtyard. In those early months, the stone balustrade was merely stone—a ledge upon which pigeons rested, a place to air damp linen in the crisp April breeze. It had not yet become an altar. It had not yet learned the weight of two elbows pressed against its grain, night after night, waiting for footsteps that the cobblestones refused to return.',
 '/assets/come-home-bride.jpg',
 1, 'published', NOW() - INTERVAL '80 days', NOW(), NOW()),

('c2222222-2222-2222-2222-222222222222',
 'THE FIRST BELL',
 'the-first-bell',
 'CHAPTER II',
 'The hour in which a promise first began to sound like an absence.',
 'The mobilization dispatch was pinned to the door of the garrison on a Tuesday. By Thursday, the steam engine at Keleti station had swallowed three thousand men, and the soot hung over the district like grease on cold mutton.

You kissed the hollow beneath my collarbone and said, “Do not pack away the summer clothes. I will be home before the chestnuts drop.”

It is curious how a sentence spoken in haste can outlive the empire that conscripted it. I did not pack the linen suits. I hung them in the wardrobe with blocks of cedar, and when the leaves on Thököly út turned yellow and fell upon the stone walkway, I stood on the balcony and told the autumn wind that you were merely detained by poor rail connections.',
 '/assets/grief-and-waiting.jpg',
 2, 'published', NOW() - INTERVAL '60 days', NOW(), NOW()),

('c3333333-3333-3333-3333-333333333333',
 'THE BYGONE BALCONY',
 'the-bygone-balcony',
 'CHAPTER III',
 'Where the years gathered, one season upon another.',
 'Years do not arrive in processions; they seep through window frames like November damp.

The neighbors grew polite in that cruel way reserved for the afflicted. At first, Frau Horthy from the second floor brought broth; by the fourth winter, she simply lowered her eyes when we passed on the spiral staircase, fearing perhaps that my condition was contagious. For devotion, when sustained past all practical reason, is viewed by the world as an indecency.

A letter did arrive once. The paper was stamped by the Ministry of War in Vienna, folded into three equal leaves. It spoke of Galicia. It spoke of a trench whose coordinates had already been plowed back into rye. I read the first sentence, folded the paper along its original creases, and laid it beneath the brass candlestick on the mantle.

To acknowledge a paper is to grant it jurisdiction over the soul. I returned to the balcony. The streetcars clattered below. The war had ended for everyone except the one who refused to surrender her vigil.',
 NULL,
 3, 'published', NOW() - INTERVAL '40 days', NOW(), NOW()),

('c4444444-4444-4444-4444-444444444444',
 'COME HOME, DEAR BRIDE',
 'come-home-dear-bride',
 'INTERLUDE II',
 'An open invitation to those who have loved beyond an ending.',
 'If you have arrived at this house carrying an unanswered letter, do not leave it on the doorstep.

There is a strange sanctuary in grief that has outlasted its object. We do not ask for explanations here. We do not ask whether the ship sank, whether the train was derailed, or whether the beloved simply walked into a different life across an unmapped border.

In this archive, waiting is not an error in calculation. It is the purest monument one mortal can raise to another. Take up the pen. Address the one whose silence you have carried. The balcony has room for every devotion that refused to turn to dust.',
 '/assets/come-home-bride.jpg',
 4, 'published', NOW() - INTERVAL '20 days', NOW(), NOW());

-- SEED LETTERS: ROOM ONE — TO THE BRIDES (to_brides)
INSERT INTO public.letters (id, category, sender_name, subject, body, moderation_status, publication_preference, is_public, submitted_at, reviewed_at) VALUES
('b1111111-0000-0000-0000-000000000001',
 'to_brides',
 'A Daughter of the City',
 'To the one who held the third floor',
 'To the brides who remained, the city has not forgotten the silence you kept on Thököly út. We pass by the stone balustrade in our hurried coats, but every winter evening when the fog gathers over the trolley cables, we look up and see that patience is more enduring than bronze.',
 'approved', 'public_review', true, NOW() - INTERVAL '14 days', NOW() - INTERVAL '13 days'),

('b1111111-0000-0000-0000-000000000002',
 'to_brides',
 'An Unnamed Pilgrim',
 'The veil that outlasted winter',
 'To the brides who remained, I left my own vows on a train forty years ago. Reading of your vigil made me understand that waiting is not a failure of courage; it is the stubborn refusal to let an absence rewrite a vow.',
 'approved', 'public_review', true, NOW() - INTERVAL '9 days', NOW() - INTERVAL '8 days');

-- SEED LETTERS: ROOM TWO — TO FÉRJEM (to_ferjem)
INSERT INTO public.letters (id, category, sender_name, subject, body, moderation_status, publication_preference, is_public, submitted_at, reviewed_at) VALUES
('f1111111-0000-0000-0000-000000000001',
 'to_ferjem',
 'She who still watches the lane',
 'The tea on the small table',
 'Dear Férjem, the leaves fell from the linden tree this morning just as they did on the week you took your valise. I still brew two cups and set yours beside the window sill where the sun warms the porcelain. It is not madness; it is simply the habit of fidelity.',
 'approved', 'public_review', true, NOW() - INTERVAL '11 days', NOW() - INTERVAL '10 days'),

('f1111111-0000-0000-0000-000000000002',
 'to_ferjem',
 'A quiet heart in Pest',
 'The metronome on the piano',
 'Dear Férjem, the violin piece you loved was played by the orchestra at the Academy yesterday. I bought two tickets and left the chair beside me empty. No one asked why.',
 'approved', 'public_review', true, NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days'),

('f1111111-0000-0000-0000-000000000003',
 'to_ferjem',
 'Anonymous Keeper',
 'Held in private confidence',
 'Dear Férjem, twenty-three years have gone by since the station smoke cleared. I write this only to remind myself that my promise was never broken.',
 'approved', 'private', false, NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days');

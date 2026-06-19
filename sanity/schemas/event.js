import {defineType, defineField} from 'sanity'

/**
 * Ascend NYC — Event schema
 *
 * One "event" document powers a card on the website:
 *  - status: "upcoming" → renders in the Upcoming Events section (#events)
 *  - status: "past"     → renders in the Past Events section (#history)
 *
 * Add an event here, hit Publish, and it appears on the live site automatically.
 */
export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Event title',
      type: 'string',
      description: 'e.g. "Wavelength: Founders & Investors Night"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      description: 'Upcoming shows in "Get in the Room". Past shows in "Rooms That Changed Things".',
      options: {
        list: [
          {title: 'Upcoming', value: 'upcoming'},
          {title: 'Past', value: 'past'},
        ],
        layout: 'radio',
      },
      initialValue: 'upcoming',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tier',
      title: 'Format / Tier',
      type: 'string',
      description: 'Drives the format badge. VIP Dinner gets the special badge styling.',
      options: {
        list: [
          {title: 'Flagship Mixer', value: 'Flagship Mixer'},
          {title: 'Founders Panel', value: 'Founders Panel'},
          {title: 'VIP Dinner', value: 'VIP Dinner'},
        ],
      },
      initialValue: 'Flagship Mixer',
    }),
    defineField({
      name: 'volume',
      title: 'Volume number',
      type: 'number',
      description: 'The "Vol. 01" number. Used for ordering past events.',
      validation: (Rule) => Rule.min(1).integer(),
    }),
    defineField({
      name: 'date',
      title: 'Event date',
      type: 'datetime',
      description: 'Optional. Leave blank for upcoming events where the date is revealed on registration.',
    }),
    defineField({
      name: 'dateLabel',
      title: 'Date label (override)',
      type: 'string',
      description: 'Optional text shown instead of the date, e.g. "Date & venue revealed upon registration".',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g. "New York City" or "Private Venue".',
      initialValue: 'New York City',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle (upcoming cards)',
      type: 'string',
      description: 'Small line under the title on upcoming cards, e.g. "AI-Curated Matches Powered by VibeMatch".',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      description: 'Main photo for the card (used as the past-event card photo).',
      options: {hotspot: true},
    }),
    defineField({
      name: 'gallery',
      title: 'Photo gallery',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      description: 'Additional photos from the event (optional).',
    }),
    defineField({
      name: 'metaTags',
      title: 'Meta tags',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Short labels shown in the card meta row, e.g. "Invite Only", "VibeMatch Powered".',
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'capacity',
      title: 'Capacity label (upcoming cards)',
      type: 'string',
      description: 'e.g. "Limited capacity" or "32 seats".',
      initialValue: 'Limited capacity',
    }),
    defineField({
      name: 'approvalRequired',
      title: 'Show "Approval Required" badge',
      type: 'boolean',
      description: 'Upcoming cards only.',
      initialValue: true,
    }),
    defineField({
      name: 'stats',
      title: 'Stats (past cards)',
      type: 'array',
      description: 'Up to 3 stat callouts shown on past-event cards.',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'num', title: 'Number', type: 'string'},
            {name: 'label', title: 'Label', type: 'string'},
          ],
          preview: {select: {title: 'num', subtitle: 'label'}},
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'featured',
      title: 'Featured (large) card',
      type: 'boolean',
      description: 'Past events only — renders the larger featured card style.',
      initialValue: false,
    }),
    defineField({
      name: 'rsvpUrl',
      title: 'RSVP / Apply link (Luma)',
      type: 'url',
      description: 'Luma application link for upcoming events.',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA button label',
      type: 'string',
      description: 'Optional. Defaults to "Apply on Luma".',
    }),
  ],
  orderings: [
    {
      title: 'Volume, newest first',
      name: 'volumeDesc',
      by: [{field: 'volume', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title', subtitle: 'status', media: 'heroImage'},
    prepare({title, subtitle, media}) {
      return {title, subtitle: subtitle === 'past' ? 'Past event' : 'Upcoming event', media}
    },
  },
})

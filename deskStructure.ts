import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Events')
        .child(
          S.list()
            .title('Events')
            .items([
              S.listItem()
                .title('📅 Upcoming')
                .child(
                  S.documentTypeList('events')
                    .title('Upcoming events')
                    .filter('_type == "events" && defined(startDate) && coalesce(endDate, startDate) >= now()')
                    .defaultOrdering([{field: 'startDate', direction: 'asc'}])
                ),
              S.listItem()
                .title('⏰ Past')
                .child(
                  S.documentTypeList('events')
                    .title('Past events')
                    .filter('_type == "events" && defined(startDate) && coalesce(endDate, startDate) < now()')
                    .defaultOrdering([{field: 'startDate', direction: 'desc'}])
                ),
              S.listItem()
                .title('All')
                .child(
                  S.documentTypeList('events')
                    .title('All events')
                    .defaultOrdering([{field: 'startDate', direction: 'asc'}])
                ),
            ])
        ),
      S.listItem()
        .title('Garden')
        .child(
          S.document()
            .schemaType('garden')
            .documentId('garden')
            .title('Garden')
        ),
      ...S.documentTypeListItems().filter((li) => {
        const id = li.getId()
        return id !== 'events' && id !== 'garden'
      }),
    ])
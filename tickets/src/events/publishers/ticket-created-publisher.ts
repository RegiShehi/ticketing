import { Publisher, Subjects, TicketCreatedEvent } from '@rstickets70/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}

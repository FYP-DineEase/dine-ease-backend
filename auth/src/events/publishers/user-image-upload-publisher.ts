import {
  Subjects,
  Publisher,
  UserImageUploadedEvent,
} from '@mujtaba-web/common';

export class UserImageUploadedPublisher extends Publisher<UserImageUploadedEvent> {
  subject: Subjects.ImageUploaded = Subjects.ImageUploaded;
}

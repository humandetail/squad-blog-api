
export class CreateLogDto {
  ip: string;
  action: string;
  module: string;
  content?: string;
  result?: string;
  username?: string;
}

export class JwtService {
  signAsync(_payload: unknown): Promise<string> {
    return Promise.resolve('token');
  }
}

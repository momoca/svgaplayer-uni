import { VideoEntity } from "./video_entity";
const { inflate } = require("./pako");
const { ProtoMovieEntity } = require("./proto");

export class Parser {
  load(url: string): Promise<VideoEntity> {
    return new Promise((resolver, rejector) => {
      if (url.indexOf("http://") === 0 || url.indexOf("https://") === 0) {
        uni.request({
          url: url,
          responseType: "arraybuffer",
          success: (res) => {
            const inflatedData = inflate(res.data as any);
            const movieData = ProtoMovieEntity.decode(inflatedData);
            resolver(new VideoEntity(movieData));
          },
          fail: (error) => {
            rejector(error);
          },
        });
      } else {
        uni.getFileSystemManager().readFile({
          filePath: url,
          success: (res) => {
            const inflatedData = inflate(res.data as any);
            const movieData = ProtoMovieEntity.decode(inflatedData);
            resolver(new VideoEntity(movieData));
          },
          fail: (error) => {
            rejector(error);
          },
        });
      }
    });
  }
}

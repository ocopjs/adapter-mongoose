<!--[meta]
section: api
subSection: database-adapters
title: Mongoose adapter
[meta]-->

# Mongoose database adapter

OcopJS - Chuyển đổi cho Mongoose tới @ocopjs packages. 🇻🇳

> Lưu ý sau khi phiên bản KeystoneJS 5 dừng phát triển tính năng mới và chuyển
> sang chế độ duy trì để ra mắt phiên bản mới hơn. Chúng tôi đã dựa trên mã
> nguồn cũ này để phát triển một phiên bản khác với một số tính năng theo hướng
> microservices.

## Hướng dẫn

```javascript
const { MongooseAdapter } = require('@ocopjs/adapter-mongoose');

const ocop = new Ocop({
  adapter: new MongooseAdapter({...}),
});
```

## Cấu hình

### `mongoUri` (bắt buộc)

Tham số này được sử dụng trong `mongoose.connect()`.

**_Default:_** Biến môi trường mặc định được sử dụng xem bên dưới hoặc
`'mongodb://localhost/<DATABASE_NAME>'`

Nếu không có cấu hình riêng, Ocop.js sẽ tìm kiếm sử dụng các biến môi trường
sau:

- `CONNECT_TO`
- `DATABASE_URL`
- `MONGO_URI`
- `MONGODB_URI`
- `MONGO_URL`
- `MONGODB_URL`
- `MONGOLAB_URI`
- `MONGOLAB_URL`

### Mongoose options (tùy chọn)

Tham số này cũng được sử dụng trong `mongoose.connect()`.

**_Default:_**

```javascript
{
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}
```

Xem thêm tài liệu
[Mongoose docs](https://mongoosejs.com/docs/api.html#mongoose_Mongoose-connect)
để biết thêm thông tin chi tiết.

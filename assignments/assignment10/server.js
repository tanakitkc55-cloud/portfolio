var express = require('express');
var app = express();
let http = require('http');
var hostname = 'localhost';
var port = 3001;
var fs = require('fs/promises');
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

app.get('/portfolio', (req, res) => res.redirect('/portfolio/index.html#assignments'));
app.use('/portfolio', express.static(require('path').join(__dirname, '../..')));
app.use(express.static(__dirname));

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit('your id', socket.id);

  socket.on('send_to_all', (data) => {
    console.log(`[All] จาก ${socket.id}:`, data);
    
    // บันทึกข้อความลงไฟล์ log.json
    readandWriteFile(data);

    // ส่งข้อความไปยังทุกคน รวมถึงตัวเองด้วย โดยใช้ io.emit
    io.emit('message_received', data);
  });
})

app.get('/readlog', async (req, res) => {
  try {
    // อ่านไฟล์ log.json และส่งกลับไปให้ client ในรูปแบบ JSON
    let data = await readFile();
    res.json(JSON.parse(data));
  } catch (err) {
    res.json([]);
  }
});

const readFile = async () => {
  // ใช้ fs.readFile เพื่ออ่านไฟล์ log.json
  return await fs.readFile('log.json', 'utf8');
};

const writeFile = async (data) => {
  // ใช้ fs.writeFile เพื่อเขียนข้อมูลลงไฟล์ log.json แบบจัดรูปแบบสวยงาม
  await fs.writeFile('log.json', JSON.stringify(data, null, 2), 'utf8');
};

const readandWriteFile = async (new_msg) => {
  try {
    // อ่านข้อมูลเก่าจาก log.json, เพิ่มข้อความใหม่ และบันทึกกลับลงไป
    let data = await readFile();
    let logs = JSON.parse(data);
    logs.push(new_msg);
    await writeFile(logs);
  } catch (err) {
    // กรณีที่ยังไม่มีไฟล์ log.json ให้สร้างอาเรย์ใหม่ที่มีข้อความนี้ข้อความแรก
    let logs = [new_msg];
    await writeFile(logs);
  }
};


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
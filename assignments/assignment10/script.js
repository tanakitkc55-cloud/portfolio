const socket = io();
let username= "";

window.onload = pageLoad;

function pageLoad(){
	let submitmsg = document.getElementById("submitmsg");
	let clickok = document.getElementById("clickok");
	
	// ผูก Event listener สำหรับปุ่มส่งและปุ่มตกลง
	submitmsg.onclick = sendToAll;
	clickok.onclick = setUsername;
	
	// ตั้งค่าเริ่มต้นให้ปุ่มส่งถูกปิดไว้ก่อนจนกว่าจะใส่ Username
	submitmsg.disabled = true;
}

// รับ ID ของตัวเองจาก Server มาแสดงผลบนหน้าเว็บ
socket.on('your id', function(id){
	console.log('Your socket ID is: ' + id);
	let myIdElement = document.getElementById("your-id"); // หรือตาม id ที่ HTML กำหนด
	if (myIdElement) {
		myIdElement.innerHTML = id;
	} else {
		// เผื่อโครงสร้าง HTML ใช้ id อื่น ลองค้นหาและอัปเดต element ที่แสดง ID
		let spans = document.getElementsByTagName("span");
		for(let span of spans) {
			if(span.innerHTML.includes("agEj") || span.id === "your_id" || span.id === "myid") {
				span.innerHTML = id;
			}
		}
	}
});

// รับข้อความทั่วไป (ที่ส่งมาจาก socket.emit, socket.broadcast.emit, io.emit, io.to.emit)
socket.on('message_received', (data) => {
  postMsg(data);
});


// ส่งหาทุกคน รวมฉันด้วย (To All)
function sendToAll() {
	let d = new Date();
	
	// รองรับทั้ง id "usermsg" หรือช่อง input ในหน้าเว็บ
	let msgInput = document.getElementById("usermsg") || document.querySelector("input[type='text']:not(#userInput)");
	let text = msgInput ? msgInput.value : "";
	let time = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
	
	if (!text.trim()) return; // ถ้าไม่ได้พิมพ์ข้อความจะไม่ส่ง

	// ส่งข้อความไปยังทุกคน รวมถึงตัวเองด้วย ผ่าน event 'send_to_all'
	socket.emit('send_to_all', {
		time: time,
		user: username,
		text: text
	});

	// ล้างข้อความในช่อง input หลังส่ง
	if (msgInput) {
		msgInput.value = "";
	}
}

function postMsg(msg){
	let x = document.getElementById("chatbox");
	console.log(msg);
	let div_d = document.createElement("div");
	div_d.className = "message";
	let timemsg = document.createTextNode("("+ msg.time+") ");
	let boldmsg = document.createElement("b");
	boldmsg.innerHTML = msg.user;
	let textmsg = document.createTextNode(": "+msg.text);
	
	div_d.append(timemsg,boldmsg,textmsg);
	div_d.appendChild(document.createElement("br"));
	x.appendChild(div_d);

	checkScroll();
}

function setUsername(){
	let userInput = document.getElementById("userInput");
	
	// อัปเดตค่าให้ตัวแปร global username
	username = userInput.value;

	// ปลดล็อกปุ่มส่งข้อความและล็อกช่องกรอกชื่อ
	document.getElementById("submitmsg").disabled = false;
	document.getElementById("clickok").disabled = true;
	readLog();
}

const readLog = (async () => {
	try {
		// ใช้ fetch เพื่อดึงข้อมูลจาก endpoint "/readlog" และแปลงเป็น JSON
		let response = await fetch("/readlog");
		let data = await response.json();
		
		// วนลูปแสดงประวัติข้อความเก่าใน chatbox
		data.forEach(msg => {
			postMsg(msg);
		});
	} catch (err) {
		console.log(err);
	}
});


function checkScroll(){
	let chatbox = document.getElementById('chatbox');
	let scroll = chatbox.scrollTop+chatbox.clientHeight === chatbox.scrollHeight;
	if (!scroll) {
    	chatbox.scrollTop = chatbox.scrollHeight;
  	}
}
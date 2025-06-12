// // Product ID:	0x003d
// // Vendor ID:	0x1504

const path = require("path")
const escpos = require("escpos");

escpos.USB = require("escpos-usb");
// escpos.Network = require("escpos-network")

const options = {
  encoding: "GB18030"
};

const logo = path.join(__dirname, "assets/logo.png");

function print (number, department) { 
  // const device = new escpos.USB(0x1504, 0x003d);
  // const device = new escpos.USB(0x0e32, 0x04b8);
  const device = new escpos.USB(0x04b8, 0x0e32);
  // const device = new escpos.Network('192.168.0.127', 8008);
  // 192.168.0.127 8008
  
  const printer = new escpos.Printer(device, options);

  escpos.Image.load(logo, function (image) {
    device.open(function () {
      printer
      .align("ct")
      .image(image, "d24")
      .then((res) => {
        res
        .feed(2)
        .style("normal")
        .font('c')
        .size(1,1)
        .text('Por favor espere su turno.')
        .feed(1)
        .text('Please wait for your turn.')
        .feed(4)
        .size(8,8)
        .text(number)
        .size(1,1)
        .feed()
        .text(department)
        .feed(4)
        .cut()
        .close()
      });
    });
  });
}

print("134", "DMV")
// // Product ID:	0x003d
// // Vendor ID:	0x1504

const path = require("path")
const escpos = require("escpos");

escpos.USB = require("escpos-usb");

const options = {
  encoding: "GB18030"
};

const logo = path.join(__dirname, "assets/logo.png");

export function print (number, department) { 
  // const device = new escpos.USB(0x1504, 0x003d);  // bixolon (qms)
  const device = new escpos.USB(0x04b8, 0x0e32);  // epson (qms-4)
  
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
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
  const device = new escpos.USB(0x1504, 0x003d);
  
  const printer = new escpos.Printer(device, options);

  escpos.Image.load(logo, function (image) {
    device.open(function () {
      printer
      .align("ct")
      .image(image, "d24")
      .then((res) => {
        res
        .feed(1)
        .style("normal")
        .font('c')
        .size(1,1)
        .text('Por favor espere su turno')
        .feed(2)
        .size(2,2)
        .text('Su numero es')
        .feed(2)
        .size(8,8)
        .text(number)
        .size(1,1)
        // .feed()
        .text(department)
        .feed(4)
        .cut()
        .close()
      });
    });
  });
}
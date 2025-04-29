# English
# NodeVNCViewer
NodeVNCServer is a NodeJS application that allows you to control computers using TightVNC over the web. You can use the VNC screen within your site with the help of an iframe in your project.

## Installation and Usage
### Setup for the Computer to be Controlled
It is sufficient to install TightVNC on the computer to be controlled and run it on port 5900. The password will be the one entered on the web page. The port number can be changed from the client.js file.

### Server Setup

- Install NodeJS from the official NodeJS website for the server: https://nodejs.org/en/download

  To check the installation, type 'node -v' in the command line

- To install the necessary packages: 'npm install rfb2 express http fast-png cors socket.io'

- Using PM2 for Continuous Operation

  Open the command line in the folder where the code is located and follow the steps below: 
  
  Install the PM2 module: 'npm install pm2 -g'

- Start the server:

  Note: Before starting the server, do not forget to adjust the ip+port part in the 'client.js' file according to your setup.

  Normal start: 'pm2 start server.js'

  For regular restarts: 'pm2 start server.js --cron-restart "0 */1 * * *"' (restarts every hour)

  'pm2 save'

- To start automatically when the computer is turned on (Linux):
  
  'pm2 startup'

- To start automatically when the computer is turned on (Windows):

  Create a file named pm2-start.txt

  Add the following lines to the file:

  ```
  C:\Users\YOUR_USERNAME\AppData\Roaming\npm\node_modules\pm2\bin

  pm2 resurrect
  ```

  Note: The installation path of PM2 may vary according to your system. Do not forget to edit the batch file by checking the installation path.

  Change the file extension to .bat

  Press Win+R, type 'shell:startup', and copy the .bat file to the folder that opens

### PM2 Commands

- 'pm2 list' - Lists saved PM2 tasks

- 'pm2 stop server' - Stops the running PM2 task

- 'pm2 delete server' - Deletes the server from the PM2 list

- 'pm2 restart server' - Restarts the server

- 'pm2 logs "server"' - Shows log records

### Using with iframe on Your Site
To use VNCViewer on your site, add the iframe tag and write the link (server ip + server port) where the nodejs server is running as the source. This link is also the one in your client.js file. (For example: 192.168.1.10:8090/index.html). Then, in the server.js file, enter the address of the website you will use in the cors section.

### Troubleshooting
If you experience issues with the server:
- 'npm outdated' - Shows outdated packages
- 'npm update' - Updates outdated packages

# Türkçe
# NodeVNCViewer
NodeVNCServer, TightVNC kullanan bilgisayarları web üzerinden kontrol etmenizi sağlayan bir NodeJS uygulamasıdır. Projenizde ifame yardımı ile VNC ekranını siteniz içerisinde kullanabilirsiniz.

## Kurulum ve Kullanım
### Kontrol Edilecek Bilgisayar Kurulumu
Kontrol edilecek bilgisayara TightVNC kurmanız ve 5900 portunda çalıştırmanız yeterlidir. Şifre, web sayfasında girilen şifre olacaktır. Port numarası client.js dosyasından değiştirilebilir.

### Server Kurulumu

- Server için NodeJS resmi sitesinden NodeJS yükleyin https://nodejs.org/en/download

  Kurulumu kontrol etmek için komut satırına 'node -v' yazın

- Gerekli paketleri yüklemek için: 'npm install rfb2 express http fast-png cors socket.io'


- Sürekli Çalışma İçin PM2 Kullanımı

  Kodun bulunduğu klasörde komut satırını açıp aşağıdaki adımları takip edin: 
  
  PM2 modülünü yükleyin: 'npm install pm2 -g'


- Serveri başlatın:

  Not:Serveri başlatmadan önce 'client.js' dosyasındaki ip+port kısmını kendinize göre ayarlamayı unutmayın.

  Normal başlatma: 'pm2 start server.js'

  Düzenli yeniden başlatma için: 'pm2 start server.js --cron-restart "0 */1 * * *"' (her saat başı yeniden başlatır)

  'pm2 save'

- Bilgisayar açıldığında otomatik başlatma için(Linux):
  
  'pm2 startup'

- Bilgisayar açıldığında otomatik başlatma için(Windows):

  pm2-start.txt adında bir dosya oluşturun

  Dosyaya aşağıdaki satırları ekleyin:

  '''

  C:\Users\KULLANICI_ADI\AppData\Roaming\npm\node_modules\pm2\bin

  pm2 resurrect

  '''
  Not: PM2'nin kurulum yolu sisteminize göre farklılık gösterebilir. Kurulum yolunu kontrol ederek bat dosyasını düzenlemeyi unutmayın.

  Dosya uzantısını .bat olarak değiştirin

  Win+R tuşlarına basıp 'shell:startup' yazın ve açılan klasöre .bat dosyasını kopyalayın

### PM2 Komutları

- 'pm2 list' - Kaydedilmiş PM2 görevlerini listeler

- 'pm2 stop server' - Çalışan PM2 görevini durdurur

- 'pm2 delete server' - Serveri PM2 listesinden siler

- 'pm2 restart server' - Serveri yeniden başlatır

- 'pm2 logs "server"' - Log kayıtlarını gösterir

### iframe ile Sitenizde kullanma
VNCViewer'ı sitenizde kullanmak için iframe etiketini eklemeniz ve kaynak kısmına nodejs serverini çalıştırığınız linki(server ip + server port) yazmalısınız. Bu link aynı zamanda client.js dosyanızdaki link. ( Örnegin: 192.168.1.10:8090/index.html). Ardından server.js kısmından cors kısmından kullanacağınız websitesinin adresini girmelisiniz.

### Sorun Giderme
Server ile ilgili sorun yaşarsanız:
- 'npm outdated' - Eskimiş paketleri gösterir
- 'npm update' - Eskimiş paketleri günceller

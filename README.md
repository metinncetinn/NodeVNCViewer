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
VNCViewer'ı sitenizde kullanmak için iframe etiketini eklemeniz ve kaynak kısmına nodejs serverini çalıştırığınız linki(server ip + server port) yazmalısınız. Bu link aynı zamanda client.js dosyanızdaki link. ( Örnegin: 192.168.1.1:8090/index.html). Ardından server.js kısmından cors kısmından kullanacağınız websitesinin adresini girmelisiniz.

### Sorun Giderme
Server ile ilgili sorun yaşarsanız:
- 'npm outdated' - Eskimiş paketleri gösterir
- 'npm update' - Eskimiş paketleri günceller

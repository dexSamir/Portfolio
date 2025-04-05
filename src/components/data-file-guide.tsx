import { Info } from "lucide-react"

export const DataFileGuide = () => {
  return (
    <div className="glass-card rounded-xl p-6 mt-6">
      <div className="flex items-start gap-4">
        <div className="bg-blue-500/20 p-3 rounded-full">
          <Info className="text-blue-400" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">TypeScript Veri Dosyaları Rehberi</h3>
          <p className="text-gray-300 mb-4">
            Bu portfolyo uygulaması, verileri doğrudan TypeScript dosyalarında saklar. Veritabanı veya harici servis
            kullanmadan verilerinizi yönetmek için aşağıdaki adımları izleyin:
          </p>

          <ol className="list-decimal list-inside space-y-3 text-gray-300">
            <li>
              <strong>Veri Ekleme/Silme:</strong> Admin panelinden proje veya referans ekleyip silebilirsiniz. Bu
              veriler tarayıcınızın LocalStorage'ında geçici olarak saklanır.
            </li>
            <li>
              <strong>Veri Dosyalarını Güncelleme:</strong> Yeni veri eklediğinizde veya sildiğinizde, "TypeScript Kodu
              Oluştur" butonuna tıklayarak güncel verilerin TypeScript kodunu görebilirsiniz.
            </li>
            <li>
              <strong>Kodu Kopyalama:</strong> Oluşturulan kodu kopyalayıp, projenizin{" "}
              <code className="bg-black/30 px-2 py-1 rounded">src/data/projectdata.ts</code> ve{" "}
              <code className="bg-black/30 px-2 py-1 rounded">src/data/testimonialdata.ts</code> dosyalarına yapıştırın.
            </li>
            <li>
              <strong>Projeyi Yeniden Derleme:</strong> Değişiklikleri uygulamak için projenizi yeniden derleyin ve
              dağıtın.
            </li>
          </ol>

          <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-300 text-sm">
              <strong>Not:</strong> Bu yaklaşım, küçük ve orta ölçekli portfolyo siteleri için uygundur. Verileriniz
              doğrudan kaynak kodunuzda saklandığı için, her değişiklik için kodu güncellemeniz ve yeniden derlemeniz
              gerekir. Ancak, veritabanı veya harici servis gerektirmediği için basit ve kullanımı kolaydır.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


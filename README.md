# usecraft

Değerleri belirli bir süre boyunca değişmeden kaldıktan sonra güncellemek için kullanılan küçük bir React hook'u.

[![CI](https://github.com/zeynepbass/usecraft/actions/workflows/ci.yml/badge.svg)](https://github.com/zeynepbass/usecraft/actions/workflows/ci.yml)

## Kurulum

```sh
npm install usecraft
```

## Kullanım

```jsx
import { useDebounce } from 'usecraft';

const debouncedValue = useDebounce(value, 300);
```

## API

### `useDebounce(value, delay?)`

#### Parametreler

| Ad | Tür | Varsayılan | Açıklama |
| --- | --- | --- | --- |
| `value` | `any` | – | Gecikmeli olarak güncellenecek değer. |
| `delay` | `number` | `300` | Son değer değişikliğinden sonra beklenecek süre (milisaniye). |

#### Dönüş değeri

Gecikmeli olarak güncellenen değer döndürülür. İlk render sırasında dönüş değeri `value` ile aynıdır. Sonraki render'larda ise `value`, belirtilen `delay` süresi boyunca değişmeden kaldığında güncellenir.

#### Notlar

- Değerler `Object.is` kullanılarak karşılaştırılır. Her render sırasında yeniden oluşturulan bir nesne veya dizi, yeni bir değer olarak algılanır ve bekleme süresini yeniden başlatır. Bu durumu önlemek için `useMemo` kullanarak değeri bellekte tutabilir veya nesneden türetilen ilkel bir değeri debounce edebilirsiniz.
- `delay` değiştirildiğinde bekleyen zamanlayıcı yeniden başlatılır.
- Bileşen DOM'dan kaldırıldığında bekleyen zamanlayıcı temizlenir.

## Örnek

```jsx
import { useEffect, useState } from 'react';
import { useDebounce } from 'usecraft';

function Search() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (!debouncedSearch) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    fetch(`/api/search?q=${encodeURIComponent(debouncedSearch)}`, {
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then(setResults)
      .catch(() => {});

    return () => controller.abort();
  }, [debouncedSearch]);

  return (
    <>
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <ul>
        {results.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </>
  );
}
```

## Gereksinimler

- React 16.8 veya üzeri.
- ES modüllerini destekleyen bir paketleyici veya çalışma ortamı. Paket yalnızca ESM formatını destekler.

### React neden peer dependency olarak tanımlanıyor?

Bir hook, kendisini çağıran bileşenle aynı React örneği üzerinde çalışmalıdır. React normal bir bağımlılık olarak tanımlansaydı paket yöneticisi ikinci bir React kopyası yükleyebilirdi. Bu durum, hook'ların çalışmasını engelleyen `"Invalid hook call"` hatasına ve pakette React'in iki kez yer almasına neden olabilirdi.

React'i `peerDependency` olarak tanımlamak, paketin uygulamanın zaten kullandığı React sürümüyle çalışmasını sağlar.

## Geliştirme

```sh
npm install
npm test
npm run lint
npm run build
```

`dist/` klasörü Git deposuna eklenmez. Bu klasör, `prepack` betiği tarafından oluşturulur. Böylece `npm pack` ve `npm publish` komutlarıyla hazırlanan paketin içinde derlenmiş dosyaların bulunması sağlanır.

### Paketi yerel olarak deneme

Paketin yerel bir kopyasını başka bir React projesine yüklemek için oluşturulan `.tgz` dosyasını kullanabilirsin. `npm link` yönteminden farklı olarak bu yöntem, yayımlanacak dosyaların aynısını yükler ve bağımlılık ağacında ikinci bir React kopyası oluşması riskini azaltır.

```sh
npm pack
cd ../my-app
npm install ../usecraft/usecraft-1.0.0.tgz
```

### Yeni sürüm yayımlama

```sh
npm version patch   # veya minor / major
npm publish
git push --follow-tags
```

## Sürüm Yönetimi

Bu paket, [Semantic Versioning (Anlamsal Sürümleme)](https://semver.org/) standardını (`MAJOR.MINOR.PATCH`) takip eder.

- **PATCH** – API'yi değiştirmeyen hata düzeltmeleri.
- **MINOR** – Geriye dönük uyumlu yeni özellikler.
- **MAJOR** – Fonksiyon imzasının değiştirilmesi veya desteklenen bir React sürümünün kaldırılması gibi geriye dönük uyumluluğu bozan değişiklikler.

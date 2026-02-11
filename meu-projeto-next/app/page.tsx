import HeaderComponent from "../components/header-component";
import CategoryCarousel from "@/components/category-carousel";
import ProductCard from "@/components/product-card";

export default function Home() {
return ( <div> <HeaderComponent /> <CategoryCarousel />

  <div className="min-h-screen bg-amber-50 font-sans px-4 py-6">
    <main className="max-w-6xl mx-auto">

      {/* GRID DE PRODUTOS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

        <ProductCard
          name="Prato Feito Completo"
          description="Arroz, feijão, bife acebolado, batata frita e salada."
          price={24.9}
          image="/prato-feito.jpg"
        />

        <ProductCard
          name="Strogonoff de Frango"
          description="Acompanha arroz branco e batata palha."
          price={22.9}
          image="/strogonoff.jpg"
        />

      </div>

    </main>
  </div>
</div>

);
}

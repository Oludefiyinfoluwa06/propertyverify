import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FavoriteButton from '@/components/PropertyActions/FavoriteButton';
import ShareButton from '@/components/PropertyActions/ShareButton';

import api from '@/lib/api';

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const payload = await api.get(`/api/properties/${id}`);
    const property = payload.data?.property || payload.property || payload;

    const images: string[] = property.images && property.images.length ? property.images : (property.photos || []);

    return (
    <>
      <Header />

      <main className="max-w-5xl mx-auto py-10 px-4">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">{property.title || property.name}</h1>
              <div className="text-gray-600">{property.address || property.location || ''}</div>
              <div className="text-2xl font-bold text-green-600">{property.price ? `₦${property.price}` : property.listingPrice}</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {images && images.length ? (
                  images.map((src: string, idx: number) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={idx} src={src.startsWith('http') ? src : `${api.rawBase}${src.startsWith('/') ? '' : '/'}${src}`} alt={`image-${idx}`} className="w-full h-64 object-cover rounded" />
                  ))
                ) : (
                  <div className="w-full h-64 bg-gray-100 flex items-center justify-center">No images</div>
                )}
              </div>

              <div className="mt-4 prose max-w-none">
                <h2>Description</h2>
                <p>{property.description || property.summary || 'No description provided.'}</p>
              </div>
            </div>
          </div>

          <aside className="p-4 bg-white border rounded">
            <div className="mb-4">
              <h3 className="font-semibold">Agent</h3>
              <div className="text-sm text-gray-700">{property.agent?.name || property.postedBy?.name || 'Agent details not available'}</div>
              <div className="text-sm text-gray-500">{property.agent?.phone || property.postedBy?.phone || ''}</div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold">Verification</h3>
              <div className="text-sm text-gray-700">{property.verification?.status || 'Not verified'}</div>
            </div>

            <div className="flex space-x-2">
              <FavoriteButton propertyId={property._id || property.id} />
              <ShareButton propertyId={property._id || property.id} />
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
    );
  } catch {
    return (
      <div>
        <Header />
        <main className="max-w-4xl mx-auto p-8">Could not load property</main>
        <Footer />
      </div>
    );
  }
}

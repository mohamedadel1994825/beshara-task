import { getProductById } from '@/services/api';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    try {
        const { id } = await params;
        const product = await getProductById(id);

        return {
            title: product.title,
            description: product.description,
        };
    } catch (error) {
        console.error('Failed to generate metadata:', error);
        return {
            title: 'Product Details',
            description: 'View product details',
        };
    }
} 
import {
  ClientResponse,
  ProductProjection,
  ProductProjectionPagedQueryResponse,
} from '@commercetools/platform-sdk';
import { Grid, Paper, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { getProducts } from '@/api/clientService';
import ErrorAlert from '@/components/errorAlert/ErrorAlert';
import Loader from '@/components/loader/Loader';
import { useCatalogStore } from '@/stores/catalogStore';

import CatalogBreadcrumbs from './CatalogBreadCrumbs';
import Categories from './Categories';
import ProductCard from './ProductCard';

function CatalogPage(): JSX.Element {
  const categoryId = useCatalogStore((state) => state.categoryId);
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['products', categoryId],
    queryFn: () => getProducts(categoryId),
    select: (data: ClientResponse<ProductProjectionPagedQueryResponse>) => data.body.results,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    console.error(error);
    return <ErrorAlert />;
  }

  return (
    <>
      <Grid container spacing={2}>
        {/* Первая колонка */}
        <Grid item xs={2}>
          <Paper sx={{ pt: '10px' }}>
            <Typography align="center" variant="h6">
              Categories
            </Typography>
            <Categories />
          </Paper>
        </Grid>
        {/* Вторая колонка */}
        <Grid item xs={10}>
          <Grid container direction="column" spacing={2}>
            {/* Первый ряд второй колонки */}

            <Grid item>
              <CatalogBreadcrumbs />
              <Paper>
                <Typography variant="h6">Вторая колонка - Ряд 1</Typography>
                <Typography>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Typography>
              </Paper>
            </Grid>
            {/* Второй ряд второй колонки */}
            <Grid item>
              <Grid container spacing={2}>
                {data?.map((item: ProductProjection) => (
                  <ProductCard
                    description={item.metaDescription?.en}
                    discount={item.masterVariant.prices?.[0].discounted?.value.centAmount}
                    discountId={item.masterVariant.prices?.[0].discounted?.discount.id}
                    imageUrl={item.masterVariant.images?.[0].url}
                    key={item.key}
                    name={item.name.en}
                    price={item.masterVariant.prices?.[0].value.centAmount}
                  />
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default CatalogPage;

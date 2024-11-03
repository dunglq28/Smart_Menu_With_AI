import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import style from "./Brand.module.scss";
import { Image } from "@chakra-ui/react";
import moment from "moment";
import { getBrandOptions } from "@/utils";
import { ActionMenuBrand, Loading, NavigationDot } from "@/components";
import { useDelete, useFetchData, usePagination, useUpdate } from "@/hooks";
import { BrandService } from "@/services";
import { BrandData, brandUpdate } from "@/payloads";

function Brand() {
  const location = useLocation();
  const navigate = useNavigate();
  const flagRef = useRef(false);

  useEffect(() => {
    if (location.state?.toastMessage && !flagRef.current) {
      toast.success(location.state.toastMessage, {
        autoClose: 2500,
      });
      flagRef.current = true;
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate]);

  const { currentPage, rowsPerPage, handlePageChange, handleRowsPerPageChange } = usePagination({
    initialRowsPerPage: 6,
    initialRowsPerPageOptions: [6],
  });

  const { data, isLoading, fetchData, totalPages, totalRecords } = useFetchData<BrandData>(
    {
      fetchFunction: (page, limit) => BrandService.getBrands(page, limit),
      isAllLoad: true,
    },
    { currentPage, rowsPerPage },
  );

  useEffect(() => {
    if (!flagRef.current) {
      fetchData();
      flagRef.current = true;
    } else {
      fetchData();
    }
  }, [currentPage, rowsPerPage]);

  const { handleDelete } = useDelete(
    { deleteFunction: (id) => BrandService.deleteBrand(id), fetchData },
    {
      currentPage,
      rowsPerPage,
      totalRecords,
      handlePageChange,
    },
  );

  const { handleEdit } = useUpdate<brandUpdate>({
    updateFunction: (id, data) => BrandService.updateBrand(data.id, data),
    fetchData,
  });

  async function handleSearch(value: string) {
    fetchData(value);
  }

  if (isLoading) {
    return (
      <div className={style.container}>
        <Loading />;
      </div>
    );
  }

  return (
    <div className={style.container}>
      <div className={style.cardContainer}>
        {data.length === 0 ? (
          <div>Không có thương hiệu để hiển thị</div>
        ) : (
          data.map((brand) => (
            <div className={style.cardWrapper} key={brand.brandId}>
              <div className={style.card}>
                <Image
                  boxSize="140px"
                  objectFit="contain"
                  loading="lazy"
                  src={brand.imageUrl}
                  alt={brand.imageName}
                />
                <div className={style.wrapperText}>
                  <div className={style.header}>{brand.brandName}</div>
                  <div className={style.createDate}>
                    Ngày tạo {moment(brand.createDate).format("DD/MM/YYYY")}
                  </div>
                </div>
                <div className={style.btnContainer}>
                  <ActionMenuBrand
                    id={brand.brandId}
                    brandName={brand.brandName}
                    userBrandId={brand.userId}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {data.length > 0 && (
        <div className={style.paginationContainer}>
          <NavigationDot
            totalPages={totalPages}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            rowsPerPageOptions={getBrandOptions(totalRecords)}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </div>
      )}
    </div>
  );
}

export default Brand;

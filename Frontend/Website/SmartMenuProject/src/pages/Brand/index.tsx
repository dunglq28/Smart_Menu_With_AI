import { useCallback, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import style from "./Brand.module.scss";
import { Image } from "@chakra-ui/react";
import NavigationDot from "../../components/NavigationDot/NavigationDot";
import {
  deleteBrand,
  getBrands,
  updateBrand,
} from "../../services/BrandService";
import { BrandData } from "../../payloads/responses/BrandData.model";
import moment from "moment";
import Loading from "../../components/Loading";
import ActionMenuBrand from "../../components/ActionMenu/ActionMenuBrand/ActionMenuBrand";
import { brandUpdate } from "../../payloads/requests/updateRequests.model";
import { getBrandOptions } from "../../utils/functionHelper";

function Brand() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState<BrandData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(6);
  const [rowsPerPageOption, setRowsPerPageOption] = useState<number[]>([6]);
  const [totalPages, setTotalPages] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
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

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      let result;

      const loadData = async () => {
        result = await getBrands(currentPage, rowsPerPage);

        setData(result.list);
        setTotalPages(result.totalPage);
        setTotalRecords(result.totalRecord);
        setRowsPerPageOption(getBrandOptions(result.totalRecord));
        setIsLoading(false);
      };

      setTimeout(loadData, 500);
    } catch (err) {
      toast.error("Lỗi khi lấy dữ liệu");
      setIsLoading(false);
    }
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    if (!flagRef.current) {
      fetchData();
      flagRef.current = true;
    } else {
      fetchData();
    }
  }, [fetchData, currentPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

  const handleRowsPerPageChange = useCallback(
    (newRowsPerPage: number) => {
      setCurrentPage(1);
      setRowsPerPage(newRowsPerPage);
    },
    [setCurrentPage, setRowsPerPage]
  );

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteBrand(id);
      if (result.statusCode === 200) {
        if ((totalRecords - 1) % rowsPerPage === 0 && currentPage > 1) {
          setCurrentPage((prevPage) => prevPage - 1);
        } else {
          fetchData();
        }
        toast.success("Xoá thương hiệu thành công");
      }
    } catch (e) {
      toast.error("Xoá thương hiệu thất bại");
    }
  };

  async function handleEdit(brand: brandUpdate) {
    try {
      var result = await updateBrand(brand);
      if (result.statusCode === 200) {
        fetchData();
        toast.success("Cập nhật thương hiệu thành công");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Cập nhật thương hiệu thất bại");
    }
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
            onPageChange={handlePageChange}
            rowsPerPageOptions={rowsPerPageOption}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </div>
      )}
    </div>
  );
}

export default Brand;

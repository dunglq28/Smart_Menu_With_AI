import axios from "axios";
import { City } from "../models/City.model";
import { District } from "../models/District.model";
import { Ward } from "../models/Ward.model";

// Function to fetch cities
export const fetchCities = async () => {
  try {
    const response = await axios.get("https://esgoo.net/api-tinhthanh/1/0.htm");
    const data = response.data;
    if (data.error === 0) {
      const cities: City[] = data.data.map((city: any) => ({
        id: city.id,
        name: city.name,
      }));
      return cities;
    } else {
      console.error("Error fetching cities:", data.error_text);
      return [];
    }
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
};

// Function to fetch districts by cityId
export const fetchDistricts = async (cityId: string) => {
  try {
    const response = await axios.get(
      `https://esgoo.net/api-tinhthanh/2/${cityId}.htm`
    );
    const data = response.data;
    if (data.error === 0) {
      const districts: District[] = data.data.map((district: any) => ({
        id: district.id,
        name: district.name,
      }));
      return districts;
    } else {
      console.error("Error fetching districts:", data.error_text);
      return [];
    }
  } catch (error) {
    console.error("Error fetching districts:", error);
    return [];
  }
};

// Function to fetch wards by districtId
export const fetchWards = async (districtId: string) => {
  try {
    const response = await axios.get(
      `https://esgoo.net/api-tinhthanh/3/${districtId}.htm`
    );
    const data = response.data;
    if (data.error === 0) {
      const wards: Ward[] = data.data.map((ward: any) => ({
        id: ward.id,
        name: ward.name,
      }));
      return wards;
    } else {
      console.error("Error fetching wards:", data.error_text);
      return [];
    }
  } catch (error) {
    console.error("Error fetching wards:", error);
    return [];
  }
};

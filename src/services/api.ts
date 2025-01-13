const API_URL = import.meta.env.VITE_WORDPRESS_API_URL;

interface HoroscopeMeta {
  zodiac_sign: string;
  prediction_date: string;
  love_prediction: string;
  career_prediction: string;
  finance_prediction: string;
  health_prediction: string;
  lucky_color: string;
  lucky_number: string;
  lucky_time: string;
}

interface HoroscopePost {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  meta: HoroscopeMeta;
}

export const horoscopeApi = {
  async getDailyHoroscope(sign: string): Promise<HoroscopePost[]> {
    const response = await fetch(
      `${API_URL}/daily_horoscope?zodiac_sign=${sign}&per_page=1`
    );

    if (!response.ok) {
      throw new Error('API Error');
    }

    return response.json();
  }
}; 
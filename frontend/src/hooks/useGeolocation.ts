
import { useCallback, useState } from 'react';

type Coordinates = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

export function useGeolocation() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Location services are not supported by this browser.');
      return;
    }

    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      position => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLoading(false);
      },
      positionError => {
        setError(
          positionError.code === positionError.PERMISSION_DENIED
            ? 'Location permission was denied. Allow location access in your browser settings.'
            : 'Unable to determine your current location.'
        );
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  }, []);

  return { coordinates, error, loading, requestLocation };
}

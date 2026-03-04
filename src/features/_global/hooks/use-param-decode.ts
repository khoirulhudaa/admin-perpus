import { simpleDecode } from '@/core/libs';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

export const useParamDecode = () => {
  const params = useParams();
  const decodeParams: { biodataId?: string | number; userId?: string | number; text?: string } = useMemo(() => {
    try {
      const r = JSON.parse(simpleDecode(params.id || ''));
      return r;
    } catch (err: unknown) {
      console.log('param not decoded', err);
      return {};
    }
  }, [params?.id]);

  return {
    decodeParams,
    params,
  };
};
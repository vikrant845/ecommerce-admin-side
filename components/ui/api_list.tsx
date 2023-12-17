import { useOrigin } from "@/hooks/use_origin";
import { useParams } from "next/navigation";
import ApiAlert from "./api_alert";

interface ApiListProps {
  entityName: string;
  entityIdName: string;
}

const ApiList: React.FC<ApiListProps> = ({ entityIdName, entityName }) => {
  const params = useParams();
  const origin = useOrigin();

  const baseUrl = `${ origin }/api/store/${ params.storeId }`;
  
  return (
    <>
      <ApiAlert
        title='GET'
        variant="public"
        description={ `${ baseUrl }/${ entityName }` }
      />
      <ApiAlert
        title='GET'
        variant="public"
        description={ `${ baseUrl }/${ entityName }/${ entityIdName }` }
      />
      <ApiAlert
        title='POST'
        variant="admin"
        description={ `${ baseUrl }/${ entityName }/${ entityIdName }` }
      />
      <ApiAlert
        title='PATCH'
        variant="admin"
        description={ `${ baseUrl }/${ entityName }/${ entityIdName }` }
      />
      <ApiAlert
        title='DELETE'
        variant="admin"
        description={ `${ baseUrl }/${ entityName }/${ entityIdName }` }
      />
    </>
  );
}

export default ApiList;
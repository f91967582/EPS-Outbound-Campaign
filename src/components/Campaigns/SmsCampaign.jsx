import EmailSection from "./SmsSection";
import { useSirWeb } from "../../hooks/useApiSirWeb";

function SmsCampaign() {

  const {data, loading, error} = useSirWeb();
  console.log("DATA:", data)
  return (
    <div>
      <EmailSection
      title="Clientes por email"
      data={data}
      loading={loading}
      error={error}
      />
    </div>
  )
}

export default SmsCampaign;
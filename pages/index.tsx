import type { NextPage } from "next";
import Image from "next/image";

import { dehydrate, QueryClient, useQuery } from "react-query";

type SpacexData = {
  name: string;
  links: {
    patch: {
      large: string;
    };
  };
};

const getSpaceXData = async () =>
  await (await fetch("https://api.spacexdata.com/v4/launches/latest")).json();

const Home: NextPage = () => {
  const { data, isLoading, isFetching } = useQuery<SpacexData>(
    "spacex",
    getSpaceXData
  );
  console.log(data);

  if (isLoading) return <div>Loading</div>;
  if (!data) return <div>No data!</div>;

  return (
    <div>
      <h2>{data?.name}</h2>
      <Image
        src={data?.links.patch.large}
        alt="image"
        width={500}
        height={500}
      />
    </div>
  );
};

export default Home;

export async function getStaticProps() {
  const client = new QueryClient();
  const data = await client.prefetchQuery<SpacexData>("spacex", getSpaceXData);
  return {
    props: {
      dehydratedState: dehydrate(client),
    },
  };
}

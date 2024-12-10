export default function LoadingBars(){
  return (
		<div className='inline-flex space-x-2'>
			<span className='loading loading-bars loading-xs'></span>
			<span className='loading loading-bars loading-sm'></span>
			<span className='loading loading-bars loading-md'></span>
			<span className='loading loading-bars loading-lg'></span>
		</div>
	);
}